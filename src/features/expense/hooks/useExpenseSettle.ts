import { useState } from 'react';
import { settleExpenseSplit } from '@/features/expense';
import type { Expense } from '@/features/expense';
import { useErrorStore } from '@/shared/store';

export const useExpenseSettle = (expense?: Expense, onRefresh?: () => void) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleBulkSettle = async () => {
    if (!expense?.shares || expense.shares.length === 0) return;

    if (expense.status === 'paid') {
      useErrorStore.getState().showError({
        title: '알림',
        message: '이미 정산 완료된 항목입니다.',
      });
      return;
    }

    try {
      for (const share of expense.shares) {
        const splitId = share.id;
        if (!splitId) continue;

        await settleExpenseSplit(Number(splitId), { isBulkComplete: true });
      }

      useErrorStore.getState().showError({
        title: '완료',
        message: '전체 정산이 완료되었습니다.',
      });

      onRefresh?.();
    } catch (error) {
      console.error('전체 정산 실패:', error);

      useErrorStore.getState().showError({
        title: '오류',
        message: '전체 정산 처리에 실패했습니다.',
      });
    }
  };

  const handleIndividualSubmit = async (selectedSplitIds: (number | string)[]) => {
    if (selectedSplitIds.length === 0) {
      useErrorStore.getState().showError({
        title: '알림',
        message: '완료 처리할 멤버를 선택해주세요.',
      });
      return;
    }

    try {
      for (const splitId of selectedSplitIds) {
        await settleExpenseSplit(Number(splitId), { isBulkComplete: false });
      }

      useErrorStore.getState().showError({
        title: '완료',
        message: '선택된 멤버의 개별 정산이 완료되었습니다.',
      });

      setIsModalOpen(false);
      onRefresh?.();
    } catch (error) {
      console.error('개별 정산 실패:', error);

      useErrorStore.getState().showError({
        title: '오류',
        message: '개별 정산 처리에 실패했습니다.',
      });
    }
  };

  const modalMembers =
    expense?.shares?.map((share) => ({
      id: share.id,
      name: share.user?.name ?? '알 수 없음',
      amount: share.amount ?? 0,
      isPaid: share.isPaid,
    })) || [];

  return {
    isModalOpen,
    setIsModalOpen,
    handleBulkSettle,
    handleIndividualSubmit,
    modalMembers,
  };
};