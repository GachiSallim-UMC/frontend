import type { RuleStatus } from '@/shared/types';

export type RuleCategory =
  | 'noise'
  | 'cleaning'
  | 'kitchen'
  | 'bathroom'
  | 'visitor'
  | 'safety'
  | 'etc';
export type EditableRuleCategory = RuleCategory;
export type RuleApiStatus = 'ACTIVE' | 'INACTIVE';
export type RuleAgreementApiStatus = 'AGREED' | 'DISAGREED' | 'PENDING';

export interface RuleUser {
  id: string;
  name: string;
  nickname: string;
}

export interface RuleAgreementMember {
  userId: string;
  nickname: string;
  status: RuleAgreementApiStatus;
  confirmedAt: string | null;
}

export interface RuleHistory {
  id: string;
  action: string;
  message: string;
  createdAt: string;
}

/** 동의 현황 */
export interface RuleAgreement {
  agreedCount: number;
  totalCount: number;
  disagreedCount?: number;
  pendingCount?: number;
  agreedMembers: RuleUser[];
}

/** 생활 규칙 도메인 모델 */
export interface Rule {
  id: string;
  /** 상세 화면이 현재 선택된 그룹의 규칙인지 확인할 때 사용합니다. */
  groupId?: string;
  category: RuleCategory;
  categoryId?: number | null;
  categoryName?: string | null;
  title: string;
  content?: string;
  registeredBy: RuleUser;
  registeredAt: string;
  updatedAt?: string;
  agreement: RuleAgreement;
  agreements?: RuleAgreementMember[];
  myAgreementStatus?: RuleAgreementApiStatus | null;
  histories?: RuleHistory[];
  status: RuleStatus;
}

/** 생활 규칙 등록 DTO */
export interface CreateRuleDto {
  category: EditableRuleCategory;
  title: string;
  content: string;
}

export type UpdateRuleDto = CreateRuleDto;

export interface UpdateRuleAgreementDto {
  status: RuleAgreementApiStatus;
}

export interface RuleAgreementSummaryResponse {
  totalCount: number;
  agreedCount: number;
  disagreedCount: number;
  pendingCount: number;
}

export interface RuleListItemResponse {
  ruleId: number;
  groupId: number;
  categoryId: number | null;
  title: string;
  description: string | null;
  status: RuleApiStatus;
  createdBy: { userId: number; nickname: string };
  agreementSummary: RuleAgreementSummaryResponse;
  /** 백엔드가 목록 응답에 아직 내려주지 않을 수 있어 optional로 둔다 (내려주면 자동으로 활용됨) */
  myAgreementStatus?: RuleAgreementApiStatus | null;
  createdAt: string;
  updatedAt: string;
}

export interface RuleDetailResponse extends RuleListItemResponse {
  categoryName: string | null;
  agreements: Array<{
    userId: number;
    nickname: string;
    status: RuleAgreementApiStatus;
    confirmedAt: string | null;
  }>;
  histories: Array<{
    logId: number;
    action: string;
    message: string;
    createdAt: string;
  }>;
}
