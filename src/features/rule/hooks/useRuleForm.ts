import { useState } from 'react';
import type { RuleStatus } from '@/shared/types';
import type { Rule, RuleCategory } from '../types/rule.types';

/** 규칙 기본정보 폼 상태 (등록/상세 공용) */
export const useRuleForm = (rule: Rule) => {
  const [title, setTitle] = useState(rule.title);
  const [category, setCategory] = useState<RuleCategory | ''>(rule.category);
  const [content, setContent] = useState(rule.content ?? '');
  const [status, setStatus] = useState<RuleStatus | ''>(rule.status);

  return { title, setTitle, category, setCategory, content, setContent, status, setStatus };
};
