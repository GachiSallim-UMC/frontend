import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCompleteChore } from '@/features/chore';
import { useClaimExpenseTransfer, useCompleteExpenseSplits } from '@/features/expense';
import { useUpdateItemStatus } from '@/features/item';
import { useUpdateRuleAgreement } from '@/features/rule';
import type { ChatMessage, ChatMessageGroup, ChatShareCard } from '@/features/messenger';
import { buildShareCard, getExpenseShareActionState } from '@/pages/messenger/shareOptions';
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
  const claimExpenseTransfer = useClaimExpenseTransfer();
  const completeExpenseSplits = useCompleteExpenseSplits();
  const updateRuleAgreement = useUpdateRuleAgreement();
  const updateItemStatus = useUpdateItemStatus();

  // 메시지 id별로 보강된 카드 내용을 고정 (이후 실제 항목 상태 변경에 영향받지 않도록)
  const shareCardCacheRef = useRef(new Map<string, ChatShareCard>());
  // 공유 카드 액션 버튼 연타 방지용 — 처리 중인 메시지 id 집합
  const [pendingActionIds, setPendingActionIds] = useState<Set<string>>(new Set());
  const [settlementConfirmation, setSettlementConfirmation] = useState<{
    messageId: string;
    expenseId: string;
    expenseTitle: string;
    splitIds: (number | string)[];
  } | null>(null);
  // 동의 완료한 규칙 id — rules 목록 캐시가 갱신되기 전에 다시 눌러도 중복 요청되지 않도록 즉시 기록
  const agreedRuleIdsRef = useRef(new Set<string>());

  // 카드 메시지는 refId로 실제 집안일/생활비/물품/규칙 데이터를 찾아 상세 내용을 보강
  const enrichedMessageGroups = messageGroups.map(group => ({
    ...group,
    items: group.items.map(item => {
      if (!item.shareCard) return item;

      let enrichedShareCard = shareCardCacheRef.current.get(item.id);
      if (!enrichedShareCard && item.refId) {
        enrichedShareCard = buildShareCard(item.shareCard.type, item.refId, shareSourceData) ?? undefined;
      }
      if (!enrichedShareCard) return item;

      shareCardCacheRef.current.set(item.id, enrichedShareCard);

      if (item.shareCard.type === 'expense' && item.refId) {
        const expense = shareSourceData.expenses.find(entry => entry.id === item.refId);
        if (expense) {
          enrichedShareCard = {
            ...enrichedShareCard,
            ...getExpenseShareActionState(expense, currentUserId),
          };
        }
      }

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
        const ruleId = message.refId;
        const rule = shareSourceData.rules.find(item => item.id === ruleId);
        // rules 목록 캐시(새로고침 등으로 갱신된 경우)와 ref(같은 세션 내 연타)를 함께 확인한다.
        const alreadyAgreed = agreedRuleIdsRef.current.has(ruleId) || rule?.myAgreementStatus === 'AGREED';
        if (alreadyAgreed) return;

        agreedRuleIdsRef.current.add(ruleId);
        try {
          await updateRuleAgreement.mutateAsync({ id: ruleId, dto: { status: 'AGREED' } });
        } catch (error) {
          // 실패한 요청은 다시 시도할 수 있도록 되돌린다.
          agreedRuleIdsRef.current.delete(ruleId);
          throw error;
        }
      } else if (type === 'expense') {
        const expense = shareSourceData.expenses.find(item => item.id === message.refId);
        if (!expense) return;

        const actionState = getExpenseShareActionState(expense, currentUserId);
        if (actionState.actionHidden || actionState.actionDisabled) return;

        const isPayer = String(expense.payer.id) === String(currentUserId);
        if (isPayer) {
          const pendingSplitIds = expense.shares
            .filter(share => share.isPending && !share.isPaid)
            .map(share => share.id);
          if (pendingSplitIds.length === 0) return;

          setSettlementConfirmation({
            messageId: message.id,
            expenseId: expense.id,
            expenseTitle: expense.title,
            splitIds: pendingSplitIds,
          });
        } else {
          const myShare = expense.shares.find(
            share => String(share.user.id) === String(currentUserId),
          );
          if (!myShare) return;
          await claimExpenseTransfer.mutateAsync({ expenseId: expense.id, splitId: myShare.id });
        }
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

  const confirmExpenseSettlement = async () => {
    if (!settlementConfirmation || completeExpenseSplits.isPending) return;

    setPendingActionIds(prev => new Set(prev).add(settlementConfirmation.messageId));
    try {
      await completeExpenseSplits.mutateAsync({
        expenseId: settlementConfirmation.expenseId,
        splitIds: settlementConfirmation.splitIds,
      });
      setSettlementConfirmation(null);
    } finally {
      setPendingActionIds(prev => {
        const next = new Set(prev);
        next.delete(settlementConfirmation.messageId);
        return next;
      });
    }
  };

  return {
    enrichedMessageGroups,
    handleViewShareDetail,
    handleShareAction,
    pendingActionIds,
    settlementConfirmation,
    closeSettlementConfirmation: () => {
      if (!completeExpenseSplits.isPending) setSettlementConfirmation(null);
    },
    confirmExpenseSettlement,
    isSettlementPending: completeExpenseSplits.isPending,
  };
};
