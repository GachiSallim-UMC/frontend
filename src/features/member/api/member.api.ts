import { ApiError, apiClient } from '@/shared/api';
import type { MemberGroupResponse } from '../types/member.types';

const BASE = '/groups';

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const isNullableString = (value: unknown): value is string | null =>
  value === null || typeof value === 'string';

const isMemberGroupResponse = (value: unknown): value is MemberGroupResponse =>
  isRecord(value) &&
  typeof value.id === 'string' &&
  value.id.length > 0 &&
  typeof value.name === 'string' &&
  isNullableString(value.description) &&
  isNullableString(value.inviteCode) &&
  typeof value.inviteExpiredAt === 'string' &&
  typeof value.currentMembers === 'number' &&
  typeof value.maxMembers === 'number' &&
  typeof value.createdBy === 'string' &&
  typeof value.isDeleted === 'boolean' &&
  typeof value.createdAt === 'string' &&
  typeof value.updatedAt === 'string';

export const memberApi = {
  getMyGroups: async (): Promise<MemberGroupResponse[]> => {
    const { data } = await apiClient.get<MemberGroupResponse[]>(BASE);
    if (!Array.isArray(data) || !data.every(isMemberGroupResponse)) {
      throw new ApiError(502, 'INVALID_API_RESPONSE', '그룹 목록 응답 형식이 올바르지 않습니다.');
    }
    return data;
  },
};
