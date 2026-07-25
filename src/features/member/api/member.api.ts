import { ApiError, apiClient, requireSelectedGroupId } from '@/shared/api';
import type { GroupMemberResponse, MemberGroupResponse } from '../types/member.types';

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

const isGroupMemberResponse = (value: unknown): value is GroupMemberResponse => {
  return (
    isRecord(value) &&
    typeof value.id === 'string' &&
    typeof value.userId === 'string' &&
    typeof value.groupId === 'string' &&
    (value.role === 'ADMIN' || value.role === 'MEMBER') &&
    typeof value.joinedAt === 'string' &&
    isNullableString(value.leftAt) &&
    typeof value.name === 'string' &&
    typeof value.nickname === 'string' &&
    isNullableString(value.profileImage)
  );
};

export const memberApi = {
  getMyGroups: async (): Promise<MemberGroupResponse[]> => {
    const { data } = await apiClient.get<MemberGroupResponse[]>(BASE);
    if (!Array.isArray(data) || !data.every(isMemberGroupResponse)) {
      throw new ApiError(502, 'INVALID_API_RESPONSE', '그룹 목록 응답 형식이 올바르지 않습니다.');
    }
    return data;
  },

  getSelectedGroupMembers: async (): Promise<GroupMemberResponse[]> => {
    const groupId = requireSelectedGroupId();
    const { data } = await apiClient.get<unknown>(`${BASE}/${groupId}/members`);
    if (!Array.isArray(data) || !data.every(isGroupMemberResponse)) {
      throw new ApiError(
        502,
        'INVALID_API_RESPONSE',
        '그룹 멤버 목록 응답 형식이 올바르지 않습니다.',
      );
    }
    return data;
  },
};
