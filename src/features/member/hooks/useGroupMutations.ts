import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { memberApi } from '../api/member.api';
import { MEMBER_QUERY_KEYS } from './useMyGroups';
import { useAuthStore } from '@/shared/store';
import type {
  CreateGroupDto,
  JoinGroupDto,
  MemberGroupResponse,
  UpdateGroupDto,
} from '../types/member.types';

const upsertMyGroup = (
  queryClient: ReturnType<typeof useQueryClient>,
  userId: string | null,
  group: MemberGroupResponse,
) => {
  queryClient.setQueryData<MemberGroupResponse[]>(
    MEMBER_QUERY_KEYS.myGroups(userId),
    previous => [group, ...(previous ?? []).filter(previousGroup => previousGroup.id !== group.id)],
  );
};

/** 그룹 생성 훅 */
export const useCreateGroup = () => {
  const queryClient = useQueryClient();
  const userId = useAuthStore(state => state.userId);

  return useMutation({
    mutationFn: (body: CreateGroupDto) => memberApi.createGroup(body),
    onSuccess: createdGroup => {
      upsertMyGroup(queryClient, userId, createdGroup);
      queryClient.invalidateQueries({ queryKey: MEMBER_QUERY_KEYS.all });
    },
  });
};

/**초대 코드로 그룹 가입 훅 */
export const useJoinGroup = () => {
  const queryClient = useQueryClient();
  const userId = useAuthStore(state => state.userId);

  return useMutation({
    mutationFn: (body: JoinGroupDto) => memberApi.joinGroup(body),
    onSuccess: joinedGroup => {
      upsertMyGroup(queryClient, userId, joinedGroup);
      queryClient.invalidateQueries({ queryKey: MEMBER_QUERY_KEYS.all });
    },
  });
};

/**그룹 정보 수정 훅 */
export const useUpdateGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ groupId, body }: { groupId: string; body: UpdateGroupDto }) =>
      memberApi.updateGroup(groupId, body),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: MEMBER_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: ['group', variables.groupId] });
    },
  });
};

/** 그룹 삭제 훅 */
export const useDeleteGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (groupId: string) => memberApi.deleteGroup(groupId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MEMBER_QUERY_KEYS.all });
    },
  });
};

/**멤버 역할 변경 훅 */
export const useUpdateMemberRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      groupId,
      userId,
      role,
    }: {
      groupId: string;
      userId: string;
      role: 'ADMIN' | 'MEMBER';
    }) => memberApi.updateMemberRole(groupId, userId, role),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['member', 'group-members', variables.groupId] });
    },
  });
};

/** 멤버 추방 / 탈퇴 훅 */
export const useRemoveGroupMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ groupId, userId }: { groupId: string; userId: string }) =>
      memberApi.removeGroupMember(groupId, userId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['member', 'group-members', variables.groupId] });
      queryClient.invalidateQueries({ queryKey: MEMBER_QUERY_KEYS.all });
    },
  });
};

export const useGroupPermissions = (groupId: number | string | undefined) => {
  return useQuery({
    queryKey: ['group-permissions', groupId],
    queryFn: () => memberApi.getGroupPermissions(groupId!),
    enabled: !!groupId,
  });
};

export const useUpdateGroupPermissions = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: memberApi.updateGroupPermissions,
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['group-permissions', variables.groupId] });
    },
    onError: error => {
      console.error('권한 수정 실패:', error);
      alert('권한 수정에 실패했습니다. 권한이 있는지 확인해주세요.');
    },
  });
};

/** 초대 코드 미리보기 조회 훅 */
export const useInviteInfo = (code: string | undefined) => {
  return useQuery({
    queryKey: ['group', 'invite-info', code],
    queryFn: () => memberApi.getInviteInfo(code!),
    enabled: !!code,
    retry: false,
  });
};

/** 특정 그룹 상세 정보 조회 훅 */
export const useGroupDetail = (groupId: string | undefined) => {
  return useQuery({
    queryKey: ['group', groupId],
    queryFn: () => memberApi.getGroupDetail(groupId!),
    enabled: !!groupId,
  });
};
