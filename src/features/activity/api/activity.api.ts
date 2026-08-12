import { apiClient, withSelectedGroupParams } from '@/shared/api';
import { ACTIVITY_CATEGORIES } from '@/features/activity/types/activity.type';
import type { ActivityCategory, ActivityLog } from '@/features/activity/types/activity.type';

const BASE = '/activities';

export interface ActivityLogFilter {
  type?: ActivityCategory;
  userId?: number;
  page?: number;
  [key: string]: unknown;
}

interface ActivityLogResponseItem {
  id: number;
  type: ActivityCategory;
  description: string | null;
  createdAt: string;
  refId: number | null;
  user: {
    id: number;
    nickname: string;
  };
}

export interface ActivityLogListResponse {
  data: ActivityLog[];
  /** 활동 내역이 없을 때 백엔드가 내려주는 안내 메시지 */
  message?: string;
}

/** 활동 유형별 클릭 시 이동 경로. 상세 화면이 없는 유형(집안일/물품/멤버)은 목록·설정 화면으로 이동 */
const ACTIVITY_TYPE_ROUTES: Record<ActivityCategory, (refId: number | null) => string> = {
  CHORE_CREATED: () => '/chores',
  CHORE_DONE: () => '/chores',
  EXPENSE_CREATED: refId => (refId !== null ? `/expenses/${refId}` : '/expenses'),
  EXPENSE_DONE: refId => (refId !== null ? `/expenses/${refId}` : '/expenses'),
  SUPPLY_CHANGED: () => '/items',
  RULE_CREATED: refId => (refId !== null ? `/rules/${refId}` : '/rules'),
  RULE_EDITED: refId => (refId !== null ? `/rules/${refId}` : '/rules'),
  MEMBER_JOINED: () => '/group/settings',
};

/** 응답의 type이 프론트가 아는 8개 유형에 없을 수 있어(신규 enum 값 등) 런타임에도 확인 */
const isKnownActivityCategory = (type: string): type is ActivityCategory =>
  (ACTIVITY_CATEGORIES as readonly string[]).includes(type);

const toActivityLog = (item: ActivityLogResponseItem): ActivityLog => ({
  id: item.id,
  type: item.type,
  description: item.description,
  createdAt: item.createdAt,
  user: item.user,
  route: isKnownActivityCategory(item.type)
    ? ACTIVITY_TYPE_ROUTES[item.type](item.refId ?? null)
    : null,
});

type ActivityLogRawResponse =
  | ActivityLogResponseItem[]
  | { data: ActivityLogResponseItem[]; message?: string };

export const activityApi = {
  /** 그룹 최근 활동 목록 조회 (ACT-LIST-01) — groupId는 선택된 그룹으로 자동 주입 */
  getList: async (filter?: ActivityLogFilter): Promise<ActivityLogListResponse> => {
    const { data: body } = await apiClient.get<ActivityLogRawResponse>(BASE, {
      params: withSelectedGroupParams(filter),
    });
    // 현재 이 엔드포인트는 공통 응답 래핑이 중첩되어 내려와서(data.data), 백엔드가 고쳐도 안 깨지게 양쪽 다 처리
    const list = Array.isArray(body) ? body : Array.isArray(body?.data) ? body.data : [];
    const message = Array.isArray(body) ? undefined : body?.message;
    return { data: list.map(toActivityLog), message };
  },
};
