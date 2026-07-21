import { useMemo, useState } from 'react';
import type { ActivityCategory, ActivityLog, ActivityLogGroup } from '@/features/activity/types';

export const TYPE_OPTIONS = ['전체 유형', '집안일', '생활비', '공용 물품', '생활 규칙', '그룹'] as const;
export const MEMBER_OPTIONS = ['전체 멤버', '김영희', '이철수', '홍길동'] as const;
export const PERIOD_OPTIONS = ['전체', '1일', '1주일', '1달'] as const;

const CATEGORY_LABEL: Record<ActivityCategory, string> = {
  chore: '집안일',
  expense: '생활비',
  item: '공용 물품',
  rule: '생활 규칙',
  group: '그룹',
};

// 데모 데이터 기준 '오늘' — 실제 서비스 연동 시 new Date()로 대체
const TODAY = new Date('2026-06-25');

const isWithinDays = (date: string, days: number) => {
  const diffDays = (TODAY.getTime() - new Date(date).getTime()) / (1000 * 60 * 60 * 24);
  return diffDays >= 0 && diffDays < days;
};

const matchesPeriod = (date: string, period: string) => {
  if (period === '1일') return isWithinDays(date, 1);
  if (period === '1주일') return isWithinDays(date, 7);
  if (period === '1달') return isWithinDays(date, 31);
  return true; // '전체'
};

const groupByDate = (logs: ActivityLog[]): ActivityLogGroup[] => {
  const groups: ActivityLogGroup[] = [];
  logs.forEach(log => {
    const lastGroup = groups[groups.length - 1];
    if (lastGroup && lastGroup.date === log.date) {
      lastGroup.logs.push(log);
    } else {
      groups.push({ date: log.date, dateLabel: log.dateLabel, logs: [log] });
    }
  });
  return groups;
};

export const useActivityLog = (initialData: ActivityLog[]) => {
  const [typeFilter, setTypeFilter] = useState<string>(TYPE_OPTIONS[0]);
  const [memberFilter, setMemberFilter] = useState<string>(MEMBER_OPTIONS[0]);
  const [periodFilter, setPeriodFilter] = useState<string>(PERIOD_OPTIONS[0]);

  const groupedLogs = useMemo(() => {
    const filtered = initialData.filter(log => {
      const matchesType = typeFilter === TYPE_OPTIONS[0] || CATEGORY_LABEL[log.category] === typeFilter;
      const matchesMember = memberFilter === MEMBER_OPTIONS[0] || log.actorName === memberFilter;
      return matchesType && matchesMember && matchesPeriod(log.date, periodFilter);
    });
    return groupByDate(filtered);
  }, [initialData, typeFilter, memberFilter, periodFilter]);

  return {
    typeFilter,
    setTypeFilter,
    typeOptions: [...TYPE_OPTIONS],
    memberFilter,
    setMemberFilter,
    memberOptions: [...MEMBER_OPTIONS],
    periodFilter,
    setPeriodFilter,
    periodOptions: [...PERIOD_OPTIONS],
    groupedLogs,
  };
};
