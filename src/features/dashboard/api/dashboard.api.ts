import { ApiError, apiClient } from "@/shared/api";
import type { DashboardResponsePayloadDto, DashboardApiResponse } from '@/features/dashboard/types/dashboard.types'

const BASE ='/dashboard'

const isRecord = (value: unknown): value is Record<string, unknown> => 
    typeof value === 'object' && value !== null;

const isDashboardResponsePayload = (value: unknown): value is DashboardResponsePayloadDto =>
  isRecord(value) &&
  isRecord(value.summary) &&
  typeof (value.summary as Record<string, unknown>).todayChoreCount === 'number' &&
  Array.isArray(value.todayChores) &&
  Array.isArray(value.unsettledExpenses) &&
  Array.isArray(value.lowSupplies) &&
  Array.isArray(value.recentActivities);

export const dashboardApi = {
  getDashboard: async (groupId: number): Promise<DashboardResponsePayloadDto> => {
    const { data } = await apiClient.get<DashboardApiResponse>(BASE, {
      params: { groupId },
    });

    const payload = data;

    if (!isDashboardResponsePayload(payload)) {
      throw new ApiError(502, 'INVALID_API_RESPONSE', '대시보드 응답 형식이 올바르지 않습니다.');
    }

    return payload;
  },
};
