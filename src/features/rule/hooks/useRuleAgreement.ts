import { useMemo } from 'react';
import type { Rule, RuleAgreementApiStatus, RuleUser } from '../types/rule.types';

export type MyAgreement = 'agree' | 'disagree' | 'pending';
export type RuleHistoryType = 'register' | 'agree' | 'edit';

export interface RuleHistoryEntry {
  id: string;
  type: RuleHistoryType;
  title: string;
  subtitle: string;
  time: string | null;
}

const AGREEMENT_FROM_API: Record<RuleAgreementApiStatus, MyAgreement> = {
  AGREED: 'agree',
  DISAGREED: 'disagree',
  PENDING: 'pending',
};

const EMPTY_AVATAR_BY_USER_ID: ReadonlyMap<string, string | undefined> = new Map();

const getHistoryType = (action: string): RuleHistoryType => {
  const normalized = action.toUpperCase();
  if (normalized.includes('CREATE') || normalized.includes('REGISTER')) return 'register';
  if (normalized.includes('AGREE') || normalized === 'PENDING') return 'agree';
  return 'edit';
};

const formatHistoryTime = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat('ko-KR', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
};

/** 상세 응답의 멤버별 동의 상태와 히스토리를 화면 모델로 변환합니다. */
export const useRuleAgreement = (
  rule: Rule,
  currentUserId?: string | null,
  avatarByUserId: ReadonlyMap<string, string | undefined> = EMPTY_AVATAR_BY_USER_ID,
) => {
  const myAgreement = rule.myAgreementStatus
    ? AGREEMENT_FROM_API[rule.myAgreementStatus]
    : 'pending';

  const memberStatuses = useMemo(
    () =>
      (rule.agreements ?? []).map(agreement => {
        const member: RuleUser = {
          id: agreement.userId,
          name: agreement.nickname,
          nickname: agreement.nickname,
          avatarUrl: avatarByUserId.get(String(agreement.userId)),
        };
        return {
          member,
          isMe: agreement.userId === currentUserId,
          isRegistrant: agreement.userId === rule.registeredBy.id,
          agreement: AGREEMENT_FROM_API[agreement.status],
        };
      }),
    [avatarByUserId, currentUserId, rule.agreements, rule.registeredBy.id],
  );

  const historyEntries = useMemo<RuleHistoryEntry[]>(
    () =>
      (rule.histories ?? []).map(history => ({
        id: history.id,
        type: getHistoryType(history.action),
        title: history.message,
        subtitle: rule.title,
        time: formatHistoryTime(history.createdAt),
      })),
    [rule.histories, rule.title],
  );

  return { myAgreement, memberStatuses, historyEntries };
};
