import { ApiError, apiClient } from '@/shared/api';
import type {
  GroupMemberResponse,
  MemberGroupResponse,
  JoinGroupDto,
  CreateGroupDto,
  UpdateGroupDto,
  GroupPermissionsResponse,
  UpdateGroupPermissionsDto,
  InviteInfoResponse,
} from '../types/member.types';

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
  typeof value.updatedAt === 'string' &&
  (value.groupImage === undefined || isNullableString(value.groupImage));

const isGroupMemberResponse = (value: unknown): value is GroupMemberResponse =>
  isRecord(value) &&
  typeof value.userId === 'string' &&
  typeof value.groupId === 'string' &&
  (value.role === 'ADMIN' || value.role === 'MEMBER') &&
  typeof value.joinedAt === 'string' &&
  isNullableString(value.leftAt) &&
  isRecord(value.user) &&
  typeof value.user.id === 'string' &&
  typeof value.user.name === 'string' &&
  typeof value.user.nickname === 'string' &&
  isNullableString(value.user.profileImage);

export const memberApi = {
  getMyGroups: async (): Promise<MemberGroupResponse[]> => {
    const { data } = await apiClient.get<MemberGroupResponse[]>(BASE);
    if (!Array.isArray(data) || !data.every(isMemberGroupResponse)) {
      throw new ApiError(502, 'INVALID_API_RESPONSE', '그룹 목록 응답 형식이 올바르지 않습니다.');
    }
    return data;
  },

  createGroup: async (body: CreateGroupDto): Promise<MemberGroupResponse> => {
    const { data } = await apiClient.post<MemberGroupResponse>(BASE, body);
    return data;
  },

  joinGroup: async (body: JoinGroupDto): Promise<MemberGroupResponse> => {
    const { data } = await apiClient.post<MemberGroupResponse>(`${BASE}/join`, body);
    return data;
  },

  generateInviteCode: async (groupId: string): Promise<MemberGroupResponse> => {
    const { data } = await apiClient.post<MemberGroupResponse>(`${BASE}/${groupId}/invite-code`);
    return data;
  },

  getGroupDetail: async (groupId: string): Promise<MemberGroupResponse> => {
    const { data } = await apiClient.get<MemberGroupResponse>(`${BASE}/${groupId}`);
    return data;
  },

  updateGroup: async (groupId: string, body: UpdateGroupDto): Promise<MemberGroupResponse> => {
    const { data } = await apiClient.patch<MemberGroupResponse>(`${BASE}/${groupId}`, body);
    return data;
  },

  deleteGroup: async (groupId: string) => {
    await apiClient.delete(`${BASE}/${groupId}`);
  },

  /** 그룹 멤버 목록 (닉네임/프로필사진 포함) */
  getGroupMembers: async (groupId: string): Promise<GroupMemberResponse[]> => {
    const { data } = await apiClient.get<GroupMemberResponse[]>(`${BASE}/${groupId}/members`);
    if (!Array.isArray(data) || !data.every(isGroupMemberResponse)) {
      throw new ApiError(
        502,
        'INVALID_API_RESPONSE',
        '그룹 멤버 목록 응답 형식이 올바르지 않습니다.',
      );
    }
    return data;
  },

  updateMemberRole: async (groupId: string, userId: string, role: 'ADMIN' | 'MEMBER') => {
    const { data } = await apiClient.patch(`${BASE}/${groupId}/members/${userId}/role`, { role });
    return data;
  },

  removeGroupMember: async (groupId: string, userId: string) => {
    await apiClient.delete(`${BASE}/${groupId}/members/${userId}`);
  },

  getGroupPermissions: async (groupId: number | string): Promise<GroupPermissionsResponse> => {
    const { data } = await apiClient.get<GroupPermissionsResponse>(
      `/groups/${groupId}/permissions`,
    );
    return data;
  },

  updateGroupPermissions: async ({
    groupId,
    payload,
  }: {
    groupId: number | string;
    payload: UpdateGroupPermissionsDto;
  }): Promise<GroupPermissionsResponse> => {
    const { data } = await apiClient.patch<GroupPermissionsResponse>(
      `/groups/${groupId}/permissions`,
      payload,
    );
    return data;
  },

  getInviteInfo: async (code: string): Promise<InviteInfoResponse> => {
    const { data } = await apiClient.get<InviteInfoResponse>(`${BASE}/invite-info`, {
      params: { code },
    });
    return data;
  },

  regenerateInviteCode: async (groupId: string): Promise<MemberGroupResponse> => {
    const { data } = await apiClient.post<MemberGroupResponse>(`${BASE}/${groupId}/invite-code`);
    return data;
  },
};
