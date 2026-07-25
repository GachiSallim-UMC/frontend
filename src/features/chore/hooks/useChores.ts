import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { choreApi } from '../api/chore.api';
import type { ChoreFilter, CreateChoreDto, UpdateChoreDto } from '../types/chore.types';

const CHORE_KEYS = {
  all: ['chores'] as const,
  list: (filter?: ChoreFilter) => [...CHORE_KEYS.all, 'list', filter] as const,
  detail: (id: string) => [...CHORE_KEYS.all, 'detail', id] as const,
};

/** 집안일 목록 조회 훅 */
export const useChores = (filter?: ChoreFilter) =>
  useQuery({
    queryKey: CHORE_KEYS.list(filter),
    queryFn: () => choreApi.getList((filter || {}) as any),
  });

/** 집안일 상세 조회 훅 */
export const useChoreDetail = (id: string) =>
  useQuery({
    queryKey: CHORE_KEYS.detail(id),
    queryFn: () => choreApi.getDetail(id),
    enabled: Boolean(id),
  });

/** 집안일 등록 훅 */
export const useCreateChore = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateChoreDto) => choreApi.create(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: CHORE_KEYS.all });
    },
  });
};

/**집안일 수정 훅 */
export const useUpdateChore = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateChoreDto }) => choreApi.update(id, dto),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: CHORE_KEYS.all });
      queryClient.invalidateQueries({ queryKey: CHORE_KEYS.detail(variables.id) });
    },
  });
};
