/** 백엔드 ActivityLogType(Prisma enum)과 동일 */
export const ACTIVITY_CATEGORIES = [
  'CHORE_CREATED',
  'CHORE_DONE',
  'EXPENSE_CREATED',
  'EXPENSE_DONE',
  'SUPPLY_CHANGED',
  'RULE_CREATED',
  'RULE_EDITED',
  'MEMBER_JOINED',
] as const;

export type ActivityCategory = (typeof ACTIVITY_CATEGORIES)[number];

/** GET /api/v1/activities 응답 항목 */
export interface ActivityLog {
  id: number;
  type: ActivityCategory;
  description: string | null;
  createdAt: string;
  user: {
    id: number;
    nickname: string;
  };
}

export interface ActivityLogGroup {
  /** 날짜 그룹 식별 키 (YYYY-MM-DD) */
  date: string;
  /** 날짜 그룹 헤더 표시용, 예: '2026.06.25 (오늘)' */
  dateLabel: string;
  logs: ActivityLog[];
}
