import { useMemo, useState } from 'react';
import type { User } from '@/shared/types';
import { RULE_CATEGORY_LABEL } from './useRuleFilters';
import type { Rule } from '../types/rule.types';

export type MyAgreement = 'agree' | 'disagree' | 'pending';

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
  // 등록자는 규칙에 동의한 것으로 간주한다.
  const iAlreadyAgreed =
    rule.registeredBy.id === currentUser.id ||
    rule.agreement.agreedMembers.some(member => member.id === currentUser.id);
  const [myAgreement, setMyAgreement] = useState<MyAgreement>(iAlreadyAgreed ? 'agree' : 'pending');

  const memberStatuses = useMemo(
    () =>
      members.map(member => {
        const isMe = member.id === currentUser.id;
        const isRegistrant = member.id === rule.registeredBy.id;
        const agreedInRule =
          isRegistrant || rule.agreement.agreedMembers.some(agreed => agreed.id === member.id);
        // 내 행은 '나의 동의 상태' 토글 값을 즉시 반영하고, 나머지 멤버는 규칙의 동의 현황을 따른다.
        const agreement: MyAgreement = isMe ? myAgreement : agreedInRule ? 'agree' : 'pending';
        return { member, isMe, isRegistrant, agreement };
      }),
    [members, currentUser.id, rule.registeredBy.id, rule.agreement.agreedMembers, myAgreement],
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
