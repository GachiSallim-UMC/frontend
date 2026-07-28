import { useMutation, useQueryClient } from '@tanstack/react-query';
import { memberApi } from '../api/member.api';
import { MEMBER_QUERY_KEYS } from './useMyGroups';
import type { CreateGroupDto, JoinGroupDto, UpdateGroupDto } from '../types/member.types';

/** 그룹 생성 훅 */
export const useCreateGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: CreateGroupDto) => memberApi.createGroup(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MEMBER_QUERY_KEYS.all });
    },
  });
};

/**초대 코드로 그룹 가입 훅 */
export const useJoinGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: JoinGroupDto) => memberApi.joinGroup(body),
    onSuccess: () => {
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
