import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { invalidateGroupOverviewQueries } from '@/shared/lib';
import { useAlertStore } from '@/shared/store';
import { claimTransferComplete, settleExpenseSplit } from '@/features/expense/api/expense.api';
import type { Expense } from '@/features/expense/types/expense.types';
import { expenseKeys } from '@/features/expense/hooks/expense.keys';
import { useExpenseQueryScope } from '@/features/expense/hooks/useExpenseQueryScope';

const useInvalidateExpenseSettlement = () => {
  const queryClient = useQueryClient();
  const { userId, groupId } = useExpenseQueryScope();

  return async (expenseId: number | string) => {
    await Promise.all([
      queryClient.invalidateQueries({ queryKey: expenseKeys.lists(userId, groupId) }),
      queryClient.invalidateQueries({
        queryKey: expenseKeys.detail(userId, groupId, expenseId),
      }),
      invalidateGroupOverviewQueries(queryClient, groupId),
    ]);
  };
};

/** 채무자의 송금 완료 알림을 전송하고 관련 생활비 캐시를 갱신합니다. */
export const useClaimExpenseTransfer = () => {
  const invalidateSettlement = useInvalidateExpenseSettlement();

  return useMutation({
    mutationFn: ({ splitId }: { expenseId: number | string; splitId: number | string }) =>
      claimTransferComplete(splitId),
    onSuccess: async (_result, { expenseId }) => invalidateSettlement(expenseId),
  });
};

/** 선지불자가 확인한 분담 내역만 순서대로 완료 처리하고 관련 캐시를 갱신합니다. */
export const useCompleteExpenseSplits = () => {
  const invalidateSettlement = useInvalidateExpenseSettlement();

  return useMutation({
    mutationFn: async ({ splitIds }: { expenseId: number | string; splitIds: (number | string)[] }) => {
      for (const splitId of splitIds) {
        await settleExpenseSplit(Number(splitId), { isBulkComplete: true });
      }
    },
    onSettled: async (_result, _error, { expenseId }) => invalidateSettlement(expenseId),
  });
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
    await Promise.all([
      queryClient.invalidateQueries({
        queryKey: expenseKeys.lists(userId, groupId),
      }),
      ...(expense?.id
        ? [
            queryClient.invalidateQueries({
              queryKey: expenseKeys.detail(userId, groupId, expense.id),
            }),
          ]
        : []),
      invalidateGroupOverviewQueries(queryClient, groupId),
    ]);

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

  /** 채무자가 "송금완료"로 표시했지만 실제로 입금되지 않은 경우, 요청 상태(REQUESTED)로 되돌립니다. */
  const handleReject = async (splitId: number | string) => {
    try {
      await settleExpenseSplit(Number(splitId), {
        isBulkComplete: false,
      });

      await refreshExpenses();
    } catch {
      showAlert({
        title: '오류',
        message: '거절 처리에 실패했습니다.',
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
      isPending: Boolean(share.isPending),
    })) ?? [];

  return {
    isModalOpen,
    setIsModalOpen,
    handleBulkSettle,
    handleIndividualSubmit,
    handleReject,
    modalMembers,
  };
};
