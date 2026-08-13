import type { RuleStatus } from '@/shared/types';
import type { EditableRuleCategory, RuleCategory } from '@/features/rule/types/rule.types';

/** 백엔드 rule_categories seed/migration에서 모든 환경에 동일한 ID로 등록해야 합니다. */
export const RULE_CATEGORY_DEFINITIONS: ReadonlyArray<{
  value: EditableRuleCategory;
  id: number;
  label: string;
}> = [
  { value: 'noise', id: 1, label: '소음' },
  { value: 'cleaning', id: 2, label: '청소/위생' },
  { value: 'kitchen', id: 3, label: '주방/식사' },
  { value: 'bathroom', id: 4, label: '화장실/욕실' },
  { value: 'visitor', id: 5, label: '방문객' },
  { value: 'safety', id: 6, label: '안전/보안' },
  { value: 'etc', id: 7, label: '기타' },
];

export const RULE_CATEGORY_LABEL: Record<RuleCategory, string> = {
  noise: '소음',
  cleaning: '청소/위생',
  kitchen: '주방/식사',
  bathroom: '화장실/욕실',
  visitor: '방문객',
  safety: '안전/보안',
  etc: '기타',
};

export const RULE_CATEGORY_OPTIONS = RULE_CATEGORY_DEFINITIONS.map(({ value, label }) => ({
  value,
  label,
}));

export const RULE_CATEGORY_ID: Record<EditableRuleCategory, number> =
  RULE_CATEGORY_DEFINITIONS.reduce(
    (result, category) => ({ ...result, [category.value]: category.id }),
    {} as Record<EditableRuleCategory, number>,
  );

export const RULE_CATEGORY_BY_ID = new Map(
  RULE_CATEGORY_DEFINITIONS.map(category => [category.id, category.value] as const),
);

export const RULE_STATUS_OPTIONS: { value: RuleStatus; label: string }[] = [
  { value: 'active', label: '활성' },
  { value: 'inactive', label: '비활성' },
];
