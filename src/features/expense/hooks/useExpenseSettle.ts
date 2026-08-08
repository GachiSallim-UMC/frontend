import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { settleExpenseSplit, expenseKeys } from '@/features/expense';
import type { Expense } from '@/features/expense';

export const settleMyExpenseShare = async (
  expense: Expense,
  userId: string
): Promise<{ ok: boolean }> => {
  const myShare = expense.shares?.find(
    (share) => String(share.user.id) === String(userId)
  );

  if (!myShare) {
    return { ok: false };
  }

  if (myShare.isPaid) {
    return { ok: false };
  }

  try {
    await settleExpenseSplit(Number(myShare.id), {
      isBulkComplete: false,
    });

    return { ok: true };
  } catch (error) {
    console.error('내 정산 실패:', error);
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

  const refreshExpenses = async () => {
    await queryClient.invalidateQueries({
      queryKey: expenseKeys.lists(),
    });

    if (expense?.id) {
      await queryClient.invalidateQueries({
        queryKey: expenseKeys.detail(expense.id),
      });
    }

    await queryClient.refetchQueries({
      queryKey: expenseKeys.lists(),
    });

    if (expense?.id) {
      await queryClient.refetchQueries({
        queryKey: expenseKeys.detail(expense.id),
      });
    }

    onRefresh?.();
  };

  const handleBulkSettle = async () => {
    if (!expense?.shares || expense.shares.length === 0) {
      return;
    }

    if (expense.status === 'paid') {
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
    } catch (error) {
      console.error('전체 정산 실패:', error);
    }
  };

  const handleIndividualSubmit = async (
    selectedSplitIds: (number | string)[]
  ) => {
    if (selectedSplitIds.length === 0) {
      return;
    }

    try {
      for (const splitId of selectedSplitIds) {
        await settleExpenseSplit(Number(splitId), {
          isBulkComplete: false,
        });
      }

      setPaidSplitIds((prev) => [
        ...new Set([...prev, ...selectedSplitIds]),
      ]);

      await refreshExpenses();

      setIsModalOpen(false);
    } catch (error) {
      console.error('개별 정산 실패:', error);
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