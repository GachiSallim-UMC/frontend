import { useState } from 'react';
import type { EditableRuleCategory, Rule } from '@/features/rule/types/rule.types';

/** 규칙 기본정보 폼 상태 (등록/상세 공용, rule이 있으면 값 프리필) */
export const useRuleForm = (rule?: Rule) => {
  const [title, setTitle] = useState(rule?.title ?? '');
  const [category, setCategory] = useState<EditableRuleCategory | ''>(rule?.category ?? 'noise');
  const [content, setContent] = useState(rule?.content ?? '');

  return { title, setTitle, category, setCategory, content, setContent };
};
