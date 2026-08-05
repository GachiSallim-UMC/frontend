import type { ExpenseStatus, User } from '@/shared/types';

/** 분담 방식 */
export type SplitType = 'EQUAL' | 'RATIO' | 'CUSTOM';

export type ExpenseFilter = 'TOTAL' | 'THIS_MONTH';

/* 생활비 카테고리 */
export type ExpenseCategory = 
  | 'FINANCE' 
  | 'FOOD' 
  | 'SHOPPING' 
  | 'EDUCATION' 
  | 'GROCERY' 
  | 'TRANSPORT' 
  | 'LEISURE' 
  | 'CAFE' 
  | 'UTILITIES' 
  | 'ETC';

/** 멤버별 부담금 */
export interface MemberShare {
  id: string | number;
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

/** 분담 대상 멤버 (EXACT/PERCENTAGE 방식 시 상세 분담 정보 포함) */
export interface ExpenseParticipant {
  userId: string;
  amount?: number;
  percentage?: number;
}

export interface PayLinkResponse {
  deepLinkUrl: string;
  status: string;
}
export const expenseKeys = {
  all: ['expenses'] as const,
  lists: () => [...expenseKeys.all, 'list'] as const,
  detail: (id: number | string) => [...expenseKeys.all, 'detail', id] as const,
};

/** 생활비 등록 DTO */
export interface CreateExpenseDto {
  title: string;
  amount: number;
  payerId: string;
  date: string;
  splitType: SplitType;
  category: ExpenseCategory;
  targetMemberIds: ExpenseParticipant[];
  memo?: string;
  receiptUrl?: string;
}

/** 정산 금액 미리보기 요청 DTO */
export interface CalculateExpenseDto {
  totalAmount: number;
  splitType: SplitType;
  participants: number[];
  [key: string]: unknown;
}

export interface SettleExpenseSplitDto {
  isBulkComplete: boolean;
  [key: string]: unknown;
}

/* 생활비 수정 요청 DTO */
export interface UpdateExpenseDto {
  title?: string;
  totalAmount?: number;
  category?: ExpenseCategory;
  splitType?: SplitType;
  targetMemberIds?: ExpenseParticipant[];
  [key: string]: unknown;
}

/** 영수증 업로드 URL 발급 요청 DTO */
export interface RequestReceiptUploadUrlDto {
  groupId: number;
  contentType: 'image/jpeg' | 'image/png' | 'image/webp';
  fileSize: number;
}

/** 영수증 업로드 URL 발급 응답 */
export interface ReceiptUploadUrlResponse {
  uploadUrl: string;
  fields: Record<string, string>;
  objectKey: string;
}

/** 영수증 이미지 조회 URL 응답 */
export interface ReceiptViewUrlResponse {
  viewUrl: string;
}