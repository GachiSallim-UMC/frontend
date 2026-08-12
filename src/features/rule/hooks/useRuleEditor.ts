import { useCallback, useState } from 'react';
import type { Rule } from '@/features/rule/types/rule.types';
import { useRuleForm } from '@/features/rule/hooks/useRuleForm';
import { validateRuleForm, type RuleFormErrors } from '@/features/rule/lib/ruleFormValidation';

export const useRuleEditor = (rule?: Rule) => {
  const { title, setTitle, category, setCategory, content, setContent } = useRuleForm(rule);
  const [errors, setErrors] = useState<RuleFormErrors>({});

  const clearError = useCallback((field: keyof RuleFormErrors) => {
    setErrors(previous => ({ ...previous, [field]: undefined }));
  }, []);

  const validate = useCallback(() => {
    const nextErrors = validateRuleForm({ title, category, content });
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }, [category, content, title]);

  const isDirty =
    title.trim() !== (rule?.title ?? '').trim() ||
    category !== (rule?.category ?? 'noise') ||
    content.trim() !== (rule?.content ?? '').trim();

  return {
    title,
    category,
    content,
    isDirty,
    validate,
    fieldProps: {
      title,
      category,
      content,
      errors,
      onTitleChange: (value: string) => {
        setTitle(value);
        clearError('title');
      },
      onCategoryChange: (value: typeof category) => {
        setCategory(value);
        clearError('category');
      },
      onContentChange: (value: string) => {
        setContent(value);
        clearError('content');
      },
    },
  };
};
