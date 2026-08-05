import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useGroupStore } from '@/shared/store';
import { itemApi } from '../api/item.api';
import type {
  CreateItemDto,
  PurchaseItemDto,
  UpdateItemDto,
  UpdateItemStatusDto,
} from '../types/item.types';

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

  return useMutation({
    mutationFn: (dto: CreateItemDto) => itemApi.create(dto),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ITEM_KEYS.all }),
  });
};

export const useUpdateItemStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateItemStatusDto }) =>
      itemApi.updateStatus(id, dto),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ITEM_KEYS.all }),
  });
};

export const useUpdateItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateItemDto }) => itemApi.update(id, dto),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ITEM_KEYS.all }),
  });
};

export const usePurchaseItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: PurchaseItemDto }) => itemApi.purchase(id, dto),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ITEM_KEYS.all }),
  });
};

export const useDeleteItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: itemApi.remove,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ITEM_KEYS.all }),
  });
};
