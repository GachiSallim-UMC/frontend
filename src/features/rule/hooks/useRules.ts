import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useGroupStore } from '@/shared/store';
import { ruleApi } from '../api/rule.api';
import type { CreateRuleDto, UpdateRuleAgreementDto, UpdateRuleDto } from '../types/rule.types';

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

  return useMutation({
    mutationFn: (dto: CreateRuleDto) => ruleApi.create(dto),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: RULE_KEYS.all }),
  });
};

export const useUpdateRule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateRuleDto }) => ruleApi.update(id, dto),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: RULE_KEYS.all });
      queryClient.invalidateQueries({ queryKey: RULE_KEYS.detail(variables.id) });
    },
  });
};

export const useUpdateRuleAgreement = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: UpdateRuleAgreementDto }) =>
      ruleApi.updateAgreement(id, dto),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: RULE_KEYS.all });
      queryClient.invalidateQueries({ queryKey: RULE_KEYS.detail(variables.id) });
    },
  });
};

export const useShareRule = () =>
  useMutation({
    mutationFn: ruleApi.share,
  });

export const useDeleteRule = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ruleApi.remove,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: RULE_KEYS.all }),
  });
};
