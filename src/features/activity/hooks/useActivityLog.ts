import { useMemo, useState } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { activityApi } from '../api/activity.api';
import { groupByDate, matchesPeriod } from '../lib/activityDate';
import type { ActivityCategory, ActivityLog } from '../types/activity.type';

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
const getMemberOptions = (logs: ActivityLog[]): ActivityMemberOption[] => {
  const seen = new Map<number, string>();
  logs.forEach(log => {
    if (!seen.has(log.user.id)) seen.set(log.user.id, log.user.nickname);
  });

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
    // 활동 내역 페이지를 보고 있는 동안엔 다른 사용자의 활동도 반영되도록 폴링 (페이지를 벗어나면 자동으로 멈춤)
    refetchInterval: 10000,
  });

  const logs = useMemo(() => data?.pages.flatMap(page => page.data) ?? [], [data]);
  const memberOptionsList = useMemo(() => getMemberOptions(logs), [logs]);

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
