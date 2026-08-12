import { useMemo, useState } from 'react';
import type { RuleStatus } from '@/shared/types';
import type { Rule, RuleCategory } from '@/features/rule/types/rule.types';

/** 생활 규칙 목록 필터링 상태 및 파생 값 */
export const useRuleFilters = (rules: Rule[]) => {
  const [categoryFilter, setCategoryFilter] = useState<RuleCategory | ''>('');
  const [statusFilter, setStatusFilter] = useState<RuleStatus | ''>('');

  const filteredRules = useMemo(
    () =>
      rules.filter(rule => {
        if (categoryFilter && rule.category !== categoryFilter) return false;
        if (statusFilter && rule.status !== statusFilter) return false;
        return true;
      }),
    [rules, categoryFilter, statusFilter],
  );

  return { categoryFilter, setCategoryFilter, statusFilter, setStatusFilter, filteredRules };
};
