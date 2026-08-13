import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { invalidateGroupOverviewQueries } from '@/shared/lib';
import { useGroupStore } from '@/shared/store';
import { choreApi, toChore } from '@/features/chore/api/chore.api';
import type { CreateChoreDto, GetChoresParams, UpdateChoreDto } from '@/features/chore/types/chore.types';

const CHORE_KEYS = {
  all: ['chores'] as const,
  list: (params?: GetChoresParams) => [...CHORE_KEYS.all, 'list', params] as const,
};

/** 선택 그룹의 집안일 목록 조회 */
export const useChores = (params?: GetChoresParams) =>
  useQuery({
    queryKey: CHORE_KEYS.list(params),
    queryFn: () => choreApi.getList(params!),
    enabled: Boolean(params?.groupId),
    select: chores => chores.map(toChore),
  });

/** 별도 상세 API 없이 선택 그룹의 목록 응답에서 수정 대상을 찾습니다. */
export const useChoreFromList = (groupId: number | undefined, id: string) =>
  useQuery({
    queryKey: CHORE_KEYS.list(groupId ? { groupId } : undefined),
    queryFn: () => choreApi.getList({ groupId: groupId! }),
    enabled: Boolean(groupId && id),
    select: chores => chores.find(chore => String(chore.choreId) === id),
  });

export const useCreateChore = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateChoreDto) => choreApi.create(dto),
    onSuccess: async (_data, dto) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: CHORE_KEYS.all }),
        invalidateGroupOverviewQueries(queryClient, dto.groupId),
      ]);
    },
  });
};

export const useUpdateChore = () => {
  const queryClient = useQueryClient();
  const groupId = useGroupStore(state => state.selectedGroupId);
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateChoreDto }) => choreApi.update(id, dto),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: CHORE_KEYS.all }),
        invalidateGroupOverviewQueries(queryClient, groupId),
      ]);
    },
  });
};

/**집안일 삭제 훅 */
export const useRemoveChore = () => {
  const queryClient = useQueryClient();
  const groupId = useGroupStore(state => state.selectedGroupId);
  return useMutation({
    mutationFn: (id: string) => choreApi.remove(id),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: CHORE_KEYS.all }),
        invalidateGroupOverviewQueries(queryClient, groupId),
      ]);
    },
  });
};

/**집안일 완료 훅 */
export const useCompleteChore = () => {
  const queryClient = useQueryClient();
  const groupId = useGroupStore(state => state.selectedGroupId);
  return useMutation({
    mutationFn: (id: string) => choreApi.complete(id),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: CHORE_KEYS.all }),
        invalidateGroupOverviewQueries(queryClient, groupId),
      ]);
    },
  });
};

/**집안일 완료->미완료 훅 */
export const useIncompleteChore = () => {
  const queryClient = useQueryClient();
  const groupId = useGroupStore(state => state.selectedGroupId);
  return useMutation({
    mutationFn: (id: string) => choreApi.incomplete(id),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: CHORE_KEYS.all }),
        invalidateGroupOverviewQueries(queryClient, groupId),
      ]);
    },
  });
};
