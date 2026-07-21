export type ActivityCategory = 'chore' | 'expense' | 'item' | 'rule' | 'group';

export interface ActivityLog {
  id: string;
  actorName: string;
  description: string;
  category: ActivityCategory;
  /** 정렬·기간 필터용 (YYYY-MM-DD) */
  date: string;
  /** 날짜 그룹 헤더 표시용, 예: '2026.06.25 (오늘)' */
  dateLabel: string;
  /** 표시용 시각, 예: '오전 10:30' */
  time: string;
}

export interface ActivityLogGroup {
  date: string;
  dateLabel: string;
  logs: ActivityLog[];
}
