import { apiClient, withSelectedGroupParams } from '@/shared/api';
import type { ActivityCategory, ActivityLog } from '../types/activity.type';

const BASE = '/activities';

export interface ActivityLogFilter {
  type?: ActivityCategory;
  userId?: number;
  page?: number;
  [key: string]: unknown;
}

export interface ActivityLogListResponse {
  data: ActivityLog[];
  /** 활동 내역이 없을 때 백엔드가 내려주는 안내 메시지 */
  message?: string;
}

export const activityApi = {
  /** 그룹 최근 활동 목록 조회 (ACT-LIST-01) — groupId는 선택된 그룹으로 자동 주입 */
  getList: async (filter?: ActivityLogFilter): Promise<ActivityLogListResponse> => {
    const { data } = await apiClient.get<ActivityLogListResponse>(BASE, {
      params: withSelectedGroupParams(filter),
    });
    return { data: Array.isArray(data?.data) ? data.data : [], message: data?.message };
  },
};
