import { useQuery } from '@tanstack/react-query';
import { memberApi } from '../api/member.api';
import { useAuthStore } from '@/shared/store';
import type { Group, MemberGroupResponse } from '../types/member.types';

const toGroup = (group: MemberGroupResponse): Group => ({
  id: group.id,
  name: group.name,
  description: group.description ?? '',
  type: 'etc',
  address: '',
  inviteCode: group.inviteCode ?? undefined,
  createdAt: group.createdAt,
  maxMemberCount: group.maxMembers,
  memberCount: group.currentMembers,
  members: [],
  ownerId: group.createdBy,
});

export const MEMBER_QUERY_KEYS = {
  all: ['member'] as const,
  myGroups: (userId: string | null) => [...MEMBER_QUERY_KEYS.all, 'my-groups', userId] as const,
  members: (groupId: string | number) => [...MEMBER_QUERY_KEYS.all, 'members', groupId] as const,
};

/** 로그인한 사용자가 실제로 속한 그룹 목록 */
export const useMyGroups = () => {
  const userId = useAuthStore(s => s.userId);
  const accessToken = useAuthStore(s => s.accessToken);
  const query = useQuery({
    queryKey: MEMBER_QUERY_KEYS.myGroups(userId),
    queryFn: memberApi.getMyGroups,
    enabled: Boolean(accessToken && userId),
    select: groups => groups.map(toGroup),
  });

  return { ...query, data: query.data ?? [] };
};

/**집안일 담당자 지정을 위한 그룹 멤버 조회 훅 */
export const useGroupMembers = (groupId?: string | number) => {
  return useQuery({
    queryKey: MEMBER_QUERY_KEYS.members(groupId!),
    queryFn: () => memberApi.getGroupMembers(groupId!),
    enabled: !!groupId,
  });
};
