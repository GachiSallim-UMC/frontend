import type { EditableRuleCategory } from '@/features/rule/types/rule.types';

export interface RuleFormValues {
  title: string;
  category: EditableRuleCategory | '';
  content: string;
}

export type RuleFormErrors = Partial<Record<keyof RuleFormValues, string>>;

export const validateRuleForm = ({
  title,
  category,
  content,
}: RuleFormValues): RuleFormErrors => {
  const errors: RuleFormErrors = {};
  const trimmedTitle = title.trim();
  const trimmedContent = content.trim();

  if (!trimmedTitle) errors.title = '규칙 제목을 입력해 주세요.';
  else if (trimmedTitle.length > 30) errors.title = '규칙 제목은 30자 이하로 입력해 주세요.';

  if (!category) errors.category = '카테고리를 선택해 주세요.';

  if (!trimmedContent) errors.content = '상세 설명을 입력해 주세요.';
  else if (trimmedContent.length > 200) {
    errors.content = '상세 설명은 200자 이하로 입력해 주세요.';
  }

  return errors;
};
