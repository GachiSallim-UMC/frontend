import { useMemo, useState } from 'react';
import { toSelectOptions } from '@/shared/lib';
import type { RuleStatus } from '@/shared/types';
import type { Rule, RuleCategory } from '../types/rule.types';

export const RULE_CATEGORY_LABEL: Record<RuleCategory, string> = {
  noise: '소음',
  cleaning: '청결',
  trash: '쓰레기',
  kitchen: '주방/식사',
  bathroom: '화장실/욕실',
  visitor: '방문객',
  safety: '안전/보안',
  etc: '기타',
};

export const RULE_CATEGORY_OPTIONS = toSelectOptions(RULE_CATEGORY_LABEL);

export const RULE_STATUS_OPTIONS: { value: RuleStatus; label: string }[] = [
  { value: 'active', label: '활성' },
  { value: 'inactive', label: '비활성' },
];

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
