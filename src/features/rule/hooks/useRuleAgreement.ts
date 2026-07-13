import { useMemo, useState } from 'react';
import type { User } from '@/shared/types';
import type { Rule } from '../types/rule.types';

type MyAgreement = 'agree' | 'disagree' | 'pending';

interface RuleHistoryEntry {
  id: string;
  title: string;
  subtitle: string;
  time: string | null;
}

/** registeredAt("YYYY.MM.DD")과 오늘 날짜 차이를 "N일 전"으로 계산 */
const toDaysAgoLabel = (registeredAt: string) => {
  const [y, m, d] = registeredAt.split('.').map(Number);
  const registered = new Date(y, m - 1, d);
  const today = new Date();
  const diffDays = Math.floor((today.getTime() - registered.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays <= 0) return '오늘';
  return `${diffDays}일 전`;
};

/** 동의 현황 멤버별 상태, 나의 동의 토글, 규칙 히스토리 파생 */
export const useRuleAgreement = (rule: Rule, currentUser: User, members: User[]) => {
  const iAlreadyAgreed = rule.agreement.agreedMembers.some(member => member.id === currentUser.id);
  const [myAgreement, setMyAgreement] = useState<MyAgreement>(iAlreadyAgreed ? 'agree' : 'pending');

  const memberStatuses = useMemo(
    () =>
      members.map(member => {
        const isMe = member.id === currentUser.id;
        const isRegistrant = member.id === rule.registeredBy.id;
        const isAgreed = rule.agreement.agreedMembers.some(agreed => agreed.id === member.id);
        return { member, isMe, isRegistrant, isAgreed };
      }),
    [members, currentUser.id, rule.registeredBy.id, rule.agreement.agreedMembers],
  );

  const historyEntries = useMemo<RuleHistoryEntry[]>(() => {
    const entries: RuleHistoryEntry[] = [
      {
        id: 'h-created',
        title: `${rule.registeredBy.name} 님이 규칙을 등록했습니다.`,
        subtitle: `새 규칙: ${rule.title}`,
        time: toDaysAgoLabel(rule.registeredAt),
      },
    ];
    if (rule.agreement.agreedCount > 0) {
      entries.push({
        id: 'h-agreed',
        title: `현재 ${rule.agreement.agreedCount}/${rule.agreement.totalCount}명이 동의했습니다.`,
        subtitle: rule.title,
        time: null,
      });
    }
    return entries;
  }, [rule]);

  return { myAgreement, setMyAgreement, memberStatuses, historyEntries };
};
