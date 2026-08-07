import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCompleteChore } from '@/features/chore';
import { settleMyExpenseShare } from '@/features/expense';
import { useUpdateItemStatus } from '@/features/item';
import { useUpdateRuleAgreement } from '@/features/rule';
import type { ChatMessage, ChatMessageGroup, ChatShareCard } from '@/features/messenger';
import { buildShareCard } from '@/pages/messenger/shareOptions';
import type { ShareSourceData } from '@/pages/messenger/shareOptions';

/**
 * 공유 카드 메시지 관련 로직 (상세 내용 보강, "상세 보기" 이동, 액션 버튼 실행)을
 * 모아둔 훅. 여러 도메인(chore/expense/item/rule)을 조합하므로 pages 레이어에 둔다.
 */
export const useShareCardActions = (
  messageGroups: ChatMessageGroup[],
  shareSourceData: ShareSourceData,
  currentUserId: string,
) => {
  const navigate = useNavigate();
  const completeChore = useCompleteChore();
  const updateRuleAgreement = useUpdateRuleAgreement();
  const updateItemStatus = useUpdateItemStatus();

  // 메시지 id별로 보강된 카드 내용을 고정 (이후 실제 항목 상태 변경에 영향받지 않도록)
  const shareCardCacheRef = useRef(new Map<string, ChatShareCard>());
  // 공유 카드 액션 버튼 연타 방지용 — 처리 중인 메시지 id 집합
  const [pendingActionIds, setPendingActionIds] = useState<Set<string>>(new Set());
  // 동의 완료한 규칙 id — rules 목록 캐시가 갱신되기 전에 다시 눌러도 중복 요청되지 않도록 즉시 기록
  const agreedRuleIdsRef = useRef(new Set<string>());

  // 카드 메시지는 refId로 실제 집안일/생활비/물품/규칙 데이터를 찾아 상세 내용을 보강
  const enrichedMessageGroups = messageGroups.map(group => ({
    ...group,
    items: group.items.map(item => {
      if (!item.shareCard) return item;

      const cached = shareCardCacheRef.current.get(item.id);
      if (cached) return { ...item, shareCard: cached };

      if (!item.refId) return item;
      const enrichedShareCard = buildShareCard(item.shareCard.type, item.refId, shareSourceData);
      if (!enrichedShareCard) return item;

      shareCardCacheRef.current.set(item.id, enrichedShareCard);
      return { ...item, shareCard: enrichedShareCard };
    }),
  }));

  // "상세 보기" — 집안일/물품은 상세 페이지가 없어 목록으로 이동
  const handleViewShareDetail = (message: ChatMessage) => {
    const type = message.shareCard?.type;
    if (!type) return;
    if (type === 'expense' && message.refId) navigate(`/expenses/${message.refId}`);
    else if (type === 'rule' && message.refId) navigate(`/rules/${message.refId}`);
    else if (type === 'chore') navigate('/chores');
    else if (type === 'item') navigate('/items');
  };

  // 강조 버튼(정산하기/동의하기/완료 처리/구매 완료) — 실제 도메인 액션 실행 (연타 방지 가드 포함)
  const handleShareAction = async (message: ChatMessage) => {
    const type = message.shareCard?.type;
    if (!type || !message.refId || pendingActionIds.has(message.id)) return;

    setPendingActionIds(prev => new Set(prev).add(message.id));
    try {
      if (type === 'chore') {
        await completeChore.mutateAsync(message.refId);
      } else if (type === 'rule') {
        const rule = shareSourceData.rules.find(item => item.id === message.refId);
        // rules 캐시가 AGREED가 아닌 다른 값으로 갱신되면, 다른 화면에서 상태가 바뀐 것이므로 ref도 함께 지운다.
        if (rule && rule.myAgreementStatus !== 'AGREED') {
          agreedRuleIdsRef.current.delete(message.refId);
        }
        const alreadyAgreed =
          agreedRuleIdsRef.current.has(message.refId) || rule?.myAgreementStatus === 'AGREED';
        if (!alreadyAgreed) {
          await updateRuleAgreement.mutateAsync({ id: message.refId, dto: { status: 'AGREED' } });
          agreedRuleIdsRef.current.add(message.refId);
        }
      } else if (type === 'expense') {
        const expense = shareSourceData.expenses.find(item => item.id === message.refId);
        if (expense) await settleMyExpenseShare(expense, currentUserId);
      } else if (type === 'item') {
        // 정식 구매 처리는 금액/카테고리 입력 UI가 필요해 우선 재고만 "충분"으로 되돌림
        const item = shareSourceData.items.find(entry => entry.id === message.refId);
        if (item && item.status !== 'enough') {
          await updateItemStatus.mutateAsync({ id: message.refId, dto: { status: 'enough' } });
        }
      }
    } catch {
      // 실패 알림은 전역 mutationCache.onError(App.tsx)가 처리 — 여기선 unhandled rejection만 방지
    } finally {
      setPendingActionIds(prev => {
        const next = new Set(prev);
        next.delete(message.id);
        return next;
      });
    }
  };

  return { enrichedMessageGroups, handleViewShareDetail, handleShareAction, pendingActionIds };
};
