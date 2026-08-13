import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { invalidateGroupOverviewQueries } from '@/shared/lib';
import { useGroupStore } from '@/shared/store';
import { ruleApi } from '@/features/rule/api/rule.api';
import type { CreateRuleDto, UpdateRuleAgreementDto, UpdateRuleDto } from '@/features/rule/types/rule.types';

const RULE_KEYS = {
  all: ['rules'] as const,
  list: (groupId: string | null) => [...RULE_KEYS.all, 'list', groupId] as const,
  detail: (id: string) => [...RULE_KEYS.all, 'detail', id] as const,
};

export const useRules = () => {
  const groupId = useGroupStore(state => state.selectedGroupId);

  return useQuery({
    queryKey: RULE_KEYS.list(groupId),
    queryFn: ruleApi.getList,
    enabled: Boolean(groupId),
  });
};

export const useRuleDetail = (id: string) =>
  useQuery({
    queryKey: RULE_KEYS.detail(id),
    queryFn: () => ruleApi.getDetail(id),
    enabled: Boolean(id),
  });

export const useCreateRule = () => {
  const queryClient = useQueryClient();
  const groupId = useGroupStore(state => state.selectedGroupId);

  return useMutation({
    mutationFn: (dto: CreateRuleDto) => ruleApi.create(dto),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: RULE_KEYS.all }),
        invalidateGroupOverviewQueries(queryClient, groupId),
      ]);
    },
  });
};

export const useUpdateRule = () => {
  const queryClient = useQueryClient();
  const groupId = useGroupStore(state => state.selectedGroupId);

  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateRuleDto }) => ruleApi.update(id, dto),
    onSuccess: async (_, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: RULE_KEYS.all }),
        queryClient.invalidateQueries({ queryKey: RULE_KEYS.detail(variables.id) }),
        invalidateGroupOverviewQueries(queryClient, groupId),
      ]);
    },
  });
};

export const useUpdateRuleAgreement = () => {
  const queryClient = useQueryClient();
  const groupId = useGroupStore(state => state.selectedGroupId);

  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateRuleAgreementDto }) =>
      ruleApi.updateAgreement(id, dto),
    onSuccess: async (_, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: RULE_KEYS.all }),
        queryClient.invalidateQueries({ queryKey: RULE_KEYS.detail(variables.id) }),
        invalidateGroupOverviewQueries(queryClient, groupId),
      ]);
    },
  });
};

export const useDeleteRule = () => {
  const queryClient = useQueryClient();
  const groupId = useGroupStore(state => state.selectedGroupId);

  return useMutation({
    mutationFn: ruleApi.remove,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: RULE_KEYS.all }),
        invalidateGroupOverviewQueries(queryClient, groupId),
      ]);
    },
  });
};
