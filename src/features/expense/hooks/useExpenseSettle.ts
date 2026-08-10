import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAlertStore } from '@/shared/store';
import { settleExpenseSplit } from '../api/expense.api';
import type { Expense } from '../types/expense.types';
import { expenseKeys } from './expense.keys';
import { useExpenseQueryScope } from './useExpenseQueryScope';

export const settleMyExpenseShare = async (
  expense: Expense,
  userId: string
): Promise<{ ok: boolean }> => {
  const myShare = expense.shares?.find(
    (share) => String(share.user.id) === String(userId)
  );

  if (!myShare) {
    useAlertStore.getState().showAlert({
      title: '알림',
      message: '내 분담 내역을 찾을 수 없습니다.',
    });
    return { ok: false };
  }

  if (myShare.isPaid) {
    useAlertStore.getState().showAlert({
      title: '알림',
      message: '이미 정산 완료된 항목입니다.',
    });
    return { ok: false };
  }

  try {
    await settleExpenseSplit(Number(myShare.id), {
      isBulkComplete: true,
    });

    return { ok: true };
  } catch {
    useAlertStore.getState().showAlert({
      title: '오류',
      message: '정산 처리에 실패했습니다.',
    });
    return { ok: false };
  }
};

export const useExpenseSettle = (
  expense?: Expense,
  onRefresh?: () => void
) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [paidSplitIds, setPaidSplitIds] = useState<(number | string)[]>([]);
  const queryClient = useQueryClient();
  const showAlert = useAlertStore((state) => state.showAlert);
  const { userId, groupId } = useExpenseQueryScope();

  const refreshExpenses = async () => {
    await queryClient.invalidateQueries({
      queryKey: expenseKeys.lists(userId, groupId),
    });

    if (expense?.id) {
      await queryClient.invalidateQueries({
        queryKey: expenseKeys.detail(userId, groupId, expense.id),
      });
    }

    onRefresh?.();
  };

  const handleBulkSettle = async () => {
    if (!expense?.shares || expense.shares.length === 0) {
      return;
    }

    if (expense.status === 'paid') {
      showAlert({
        title: '알림',
        message: '이미 정산 완료된 항목입니다.',
      });
      return;
    }

    try {
      const unsettledShares = expense.shares.filter(
        (share) => share.id && !share.isPaid
      );

      for (const share of unsettledShares) {
        await settleExpenseSplit(Number(share.id), {
          isBulkComplete: true,
        });
      }

      setPaidSplitIds((prev) => [
        ...new Set([
          ...prev,
          ...unsettledShares.map((share) => share.id),
        ]),
      ]);

      await refreshExpenses();
    } catch {
      showAlert({
        title: '오류',
        message: '전체 정산 처리에 실패했습니다.',
      });
    }
  };

  const handleIndividualSubmit = async (
    selectedSplitIds: (number | string)[]
  ) => {
    if (selectedSplitIds.length === 0) {
      showAlert({
        title: '알림',
        message: '완료 처리할 멤버를 선택해주세요.',
      });
      return;
    }

    try {
      for (const splitId of selectedSplitIds) {
        await settleExpenseSplit(Number(splitId), {
          isBulkComplete: true,
        });
      }

      setPaidSplitIds((prev) => [
        ...new Set([...prev, ...selectedSplitIds]),
      ]);

      await refreshExpenses();

      setIsModalOpen(false);
    } catch {
      showAlert({
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
      isPaid:
        Boolean(share.isPaid) ||
        paidSplitIds.some(
          (paidId) => String(paidId) === String(share.id)
        ),
    })) ?? [];

  return {
    isModalOpen,
    setIsModalOpen,
    handleBulkSettle,
    handleIndividualSubmit,
    modalMembers,
  };
};
