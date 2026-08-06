import { useEffect, useMemo, useState } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { REALTIME_POLL_INTERVAL_MS } from '@/shared/lib';
import { activityApi } from '../api/activity.api';
import { groupByDate, matchesPeriod } from '../lib/activityDate';
import type { ActivityCategory } from '../types/activity.type';

interface ActivityMemberOption {
  id: number;
  nickname: string;
}

interface TypeFilterOption {
  label: string;
  value: ActivityCategory | null;
}

export const TYPE_FILTER_OPTIONS: TypeFilterOption[] = [
  { label: '전체 유형', value: null },
  { label: '집안일 등록', value: 'CHORE_CREATED' },
  { label: '집안일 완료', value: 'CHORE_DONE' },
  { label: '생활비 등록', value: 'EXPENSE_CREATED' },
  { label: '생활비 완료', value: 'EXPENSE_DONE' },
  { label: '공용 물품 변경', value: 'SUPPLY_CHANGED' },
  { label: '생활 규칙 등록', value: 'RULE_CREATED' },
  { label: '생활 규칙 수정', value: 'RULE_EDITED' },
  { label: '멤버 참여', value: 'MEMBER_JOINED' },
];

export const PERIOD_OPTIONS = ['전체', '1일', '1주일', '1달'] as const;
const ALL_MEMBERS_LABEL = '전체 멤버';
const PAGE_SIZE = 10;

const ACTIVITY_LOG_KEYS = {
  all: ['activityLogs'] as const,
  list: (type: ActivityCategory | null, userId: number | undefined) =>
    [...ACTIVITY_LOG_KEYS.all, 'list', type, userId] as const,
};

/** 닉네임은 유일하지 않을 수 있어(동명이인) 필터 매칭용 라벨을 id 기준으로 유일하게 만듦 */
const buildMemberOptions = (seen: Map<number, string>): ActivityMemberOption[] => {
  const nicknameCounts = new Map<string, number>();
  seen.forEach(nickname => nicknameCounts.set(nickname, (nicknameCounts.get(nickname) ?? 0) + 1));

  const occurrences = new Map<string, number>();
  return Array.from(seen, ([id, nickname]) => {
    if ((nicknameCounts.get(nickname) ?? 0) <= 1) return { id, nickname };

    const occurrence = (occurrences.get(nickname) ?? 0) + 1;
    occurrences.set(nickname, occurrence);
    return { id, nickname: `${nickname} (${occurrence})` };
  });
};

export const useActivityLog = () => {
  const [typeFilter, setTypeFilterOption] = useState<TypeFilterOption>(TYPE_FILTER_OPTIONS[0]);
  const [memberFilter, setMemberFilterOption] = useState<ActivityMemberOption | null>(null);
  const [periodFilter, setPeriodFilter] = useState<string>(PERIOD_OPTIONS[0]);
  const [seenMembers, setSeenMembers] = useState<Map<number, string>>(new Map());

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ACTIVITY_LOG_KEYS.list(typeFilter.value, memberFilter?.id),
    queryFn: ({ pageParam }) =>
      activityApi.getList({
        type: typeFilter.value ?? undefined,
        userId: memberFilter?.id,
        page: pageParam,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.data.length === PAGE_SIZE ? allPages.length + 1 : undefined,
    // 1페이지만 폴링 (여러 페이지 폴링 시 새 항목으로 경계가 밀려 중복 표시될 수 있음)
    refetchInterval: query => (query.state.data?.pages.length === 1 ? REALTIME_POLL_INTERVAL_MS : false),
    meta: { skipGlobalError: true }, // 에러는 isError로 인라인 표시하므로 전역 모달 생략
  });

  const logs = useMemo(() => data?.pages.flatMap(page => page.data) ?? [], [data]);

  // logs는 멤버 필터로 이미 좁혀진 응답이라, 옵션을 필터와 무관하게 유지하려면 누적이 필요하다.
  useEffect(() => {
    if (logs.length === 0) return;
    setSeenMembers(prev => {
      let changed = false;
      const next = new Map(prev);
      logs.forEach(log => {
        // 기존 id도 닉네임이 바뀌었으면 최신값으로 갱신 (세션 중 개명 대응)
        if (next.get(log.user.id) !== log.user.nickname) {
          next.set(log.user.id, log.user.nickname);
          changed = true;
        }
      });
      return changed ? next : prev;
    });
  }, [logs]);

  const memberOptionsList = useMemo(() => buildMemberOptions(seenMembers), [seenMembers]);

  const groupedLogs = useMemo(() => {
    const filtered = logs.filter(log => matchesPeriod(log.createdAt, periodFilter));
    return groupByDate(filtered);
  }, [logs, periodFilter]);

  const setTypeFilter = (label: string) => {
    const next = TYPE_FILTER_OPTIONS.find(option => option.label === label);
    if (!next) return;
    setTypeFilterOption(next);
  };

  const setMemberFilter = (label: string) => {
    const next = label === ALL_MEMBERS_LABEL ? null : (memberOptionsList.find(m => m.nickname === label) ?? null);
    setMemberFilterOption(next);
  };

  return {
    typeFilter: typeFilter.label,
    setTypeFilter,
    typeOptions: TYPE_FILTER_OPTIONS.map(option => option.label),
    memberFilter: memberFilter?.nickname ?? ALL_MEMBERS_LABEL,
    setMemberFilter,
    memberOptions: [ALL_MEMBERS_LABEL, ...memberOptionsList.map(member => member.nickname)],
    periodFilter,
    setPeriodFilter,
    periodOptions: [...PERIOD_OPTIONS],
    groupedLogs,
    isLoading,
    isError,
    error,
    refetch,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  };
};
