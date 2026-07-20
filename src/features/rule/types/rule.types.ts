import type { RuleStatus, User } from '@/shared/types';

/** 생활 규칙 카테고리 */
export type RuleCategory =
  | 'noise'
  | 'cleaning'
  | 'trash'
  | 'kitchen'
  | 'bathroom'
  | 'visitor'
  | 'safety'
  | 'etc';

/** 동의 현황 */
export interface RuleAgreement {
  agreedCount: number;
  totalCount: number;
  agreedMembers: User[];
}

/** 생활 규칙 도메인 모델 */
export interface Rule {
  id: string;
  category: RuleCategory;
  title: string;
  content?: string;
  registeredBy: User;
  registeredAt: string;
  agreement: RuleAgreement;
  status: RuleStatus;
}

/** 생활 규칙 등록 DTO */
export interface CreateRuleDto {
  category: RuleCategory;
  title: string;
  content?: string;
}
