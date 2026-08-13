import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  SHARED_QUERY_ROOTS,
  invalidateGroupOverviewQueries,
} from '@/shared/lib';
import { useGroupStore } from '@/shared/store';
import { itemApi } from '@/features/item/api/item.api';
import type {
  CreateItemDto,
  PurchaseItemDto,
  UpdateItemDto,
  UpdateItemStatusDto,
} from '@/features/item/types/item.types';

const ITEM_KEYS = {
  all: ['items'] as const,
  list: (groupId: string | null) => [...ITEM_KEYS.all, 'list', groupId] as const,
};

export const useItems = () => {
  const groupId = useGroupStore(state => state.selectedGroupId);

  return useQuery({
    queryKey: ITEM_KEYS.list(groupId),
    queryFn: itemApi.getList,
    enabled: Boolean(groupId),
  });
};

export const useCreateItem = () => {
  const queryClient = useQueryClient();
  const groupId = useGroupStore(state => state.selectedGroupId);

  return useMutation({
    mutationFn: (dto: CreateItemDto) => itemApi.create(dto),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ITEM_KEYS.all }),
        invalidateGroupOverviewQueries(queryClient, groupId),
      ]);
    },
  });
};

export const useUpdateItemStatus = () => {
  const queryClient = useQueryClient();
  const groupId = useGroupStore(state => state.selectedGroupId);

  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateItemStatusDto }) =>
      itemApi.updateStatus(id, dto),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ITEM_KEYS.all }),
        invalidateGroupOverviewQueries(queryClient, groupId),
      ]);
    },
  });
};

export const useUpdateItem = () => {
  const queryClient = useQueryClient();
  const groupId = useGroupStore(state => state.selectedGroupId);

  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateItemDto }) => itemApi.update(id, dto),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ITEM_KEYS.all }),
        invalidateGroupOverviewQueries(queryClient, groupId),
      ]);
    },
  });
};

export const usePurchaseItem = () => {
  const queryClient = useQueryClient();
  const groupId = useGroupStore(state => state.selectedGroupId);

  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: PurchaseItemDto }) => itemApi.purchase(id, dto),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ITEM_KEYS.all }),
        // 구매 완료 API가 생활비를 함께 생성하므로 정산 목록도 즉시 갱신합니다.
        queryClient.invalidateQueries({ queryKey: SHARED_QUERY_ROOTS.expenses }),
        invalidateGroupOverviewQueries(queryClient, groupId),
      ]);
    },
  });
};

export const useDeleteItem = () => {
  const queryClient = useQueryClient();
  const groupId = useGroupStore(state => state.selectedGroupId);

  return useMutation({
    mutationFn: itemApi.remove,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ITEM_KEYS.all }),
        invalidateGroupOverviewQueries(queryClient, groupId),
      ]);
    },
  });
};
