import type { ExpenseStatus, User } from '@/shared/types';

/** 분담 방식 */
export type SplitType = 'equal' | 'ratio';

/** 생활비 카테고리 */
export type ExpenseCategory = 'finance' | 'food' | 'shopping' | 'education' | 'grocery' | 'transport' | 'leisure' | 'cafe' | 'living' | 'etc';

/** 멤버별 부담금 */
export interface MemberShare {
  user: User;
  amount: number;
  isPaid: boolean;
}

/** 생활비 도메인 모델 */
export interface Expense {
  id: string;
  title: string;
  amount: number;
  payer: User;
  date: string;
  splitType: SplitType;
  category: ExpenseCategory;
  status: ExpenseStatus;
  shares: MemberShare[];
  memo?: string;
}

/** 생활비 등록 DTO */
export interface CreateExpenseDto {
  title: string;
  amount: number;
  payerId: string;
  date: string;
  splitType: SplitType;
  category: ExpenseCategory;
  targetMemberIds: string[];
  memo?: string;
}
