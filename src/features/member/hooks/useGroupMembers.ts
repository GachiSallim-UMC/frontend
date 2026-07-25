import { useQuery } from '@tanstack/react-query';
import { useGroupStore } from '@/shared/store';
import { memberApi } from '../api/member.api';
import { MEMBER_QUERY_KEYS } from './useMyGroups';

/** 선택한 그룹의 실제 멤버 ID 목록 */
export const useGroupMembers = () => {
  const groupId = useGroupStore(state => state.selectedGroupId);
  const query = useQuery({
    queryKey: MEMBER_QUERY_KEYS.groupMembers(groupId),
    queryFn: memberApi.getSelectedGroupMembers,
    enabled: Boolean(groupId),
  });

  return { ...query, data: query.data ?? [] };
};
