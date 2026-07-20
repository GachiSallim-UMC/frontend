import { useMemo, useState } from 'react';
import type { User } from '@/shared/types';
import { RULE_CATEGORY_LABEL } from './useRuleFilters';
import type { Rule } from '../types/rule.types';

type MyAgreement = 'agree' | 'disagree' | 'pending';

export type RuleHistoryType = 'register' | 'agree' | 'edit';

interface RuleHistoryEntry {
  id: string;
  type: RuleHistoryType;
  title: string;
  subtitle: string;
  time: string | null;
}

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
    const agreeingMember = rule.agreement.agreedMembers.find(
      member => member.id !== rule.registeredBy.id,
    );

    const entries: RuleHistoryEntry[] = [
      {
        id: 'h-edited',
        type: 'edit',
        title: `${rule.registeredBy.name} 님이 규칙을 수정했습니다.`,
        subtitle: `${RULE_CATEGORY_LABEL[rule.category]} 카테고리 변경, 상세 설명 수정`,
        time: '1일 전',
      },
    ];

    if (agreeingMember) {
      entries.push({
        id: 'h-agreed',
        type: 'agree',
        title: `${agreeingMember.name} 님이 동의했습니다.`,
        subtitle: rule.title,
        time: '2일 전',
      });
    }

    entries.push({
      id: 'h-created',
      type: 'register',
      title: `${rule.registeredBy.name} 님이 규칙을 등록했습니다.`,
      subtitle: `새 규칙: ${rule.title}`,
      time: '4일 전',
    });

    return entries;
  }, [rule]);

  return { myAgreement, setMyAgreement, memberStatuses, historyEntries };
};
