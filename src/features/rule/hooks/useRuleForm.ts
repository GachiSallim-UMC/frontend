import { useState } from 'react';
import type { RuleStatus } from '@/shared/types';
import type { EditableRuleCategory, Rule } from '../types/rule.types';

/** 규칙 기본정보 폼 상태 (등록/상세 공용, rule이 있으면 값 프리필) */
export const useRuleForm = (rule?: Rule) => {
  const [title, setTitle] = useState(rule?.title ?? '');
  const initialCategory = rule?.category === 'etc' ? '' : rule?.category;
  const [category, setCategory] = useState<EditableRuleCategory | ''>(initialCategory ?? 'noise');
  const [content, setContent] = useState(rule?.content ?? '');
  const [status, setStatus] = useState<RuleStatus | ''>(rule?.status ?? 'active');

  return { title, setTitle, category, setCategory, content, setContent, status, setStatus };
};
