import { useQuery } from '@tanstack/react-query';
import { memberApi } from '../api/member.api';
import { useAuthStore } from '@/shared/store';

export const GROUP_MEMBER_QUERY_KEYS = {
  all: ['member', 'group-members'] as const,
  list: (groupId: string | null) => [...GROUP_MEMBER_QUERY_KEYS.all, groupId] as const,
};

/** 특정 그룹에 속한 멤버 목록 */
export const useGroupMembers = (groupId: string | null) => {
  const accessToken = useAuthStore(s => s.accessToken);
  const query = useQuery({
    queryKey: GROUP_MEMBER_QUERY_KEYS.list(groupId),
    queryFn: () => memberApi.getGroupMembers(groupId as string),
    enabled: Boolean(accessToken && groupId),
  });

  return { ...query, data: query.data ?? [] };
};
