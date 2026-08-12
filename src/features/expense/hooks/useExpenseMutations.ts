import { useMutation, useQueryClient } from '@tanstack/react-query';
import { invalidateGroupOverviewQueries } from '@/shared/lib';
import { createExpense, updateExpense, deleteExpense } from '@/features/expense/api/expense.api';
import type { CreateExpenseDto, UpdateExpenseDto, Expense } from '@/features/expense/types/expense.types';
import { expenseKeys } from '@/features/expense/hooks/expense.keys';
import { useExpenseQueryScope } from '@/features/expense/hooks/useExpenseQueryScope';

export function useCreateExpense() {
  const queryClient = useQueryClient();
  const { userId, groupId } = useExpenseQueryScope();

  return useMutation<Expense, unknown, CreateExpenseDto>({
    mutationFn: dto => createExpense(dto),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: expenseKeys.lists(userId, groupId) }),
        invalidateGroupOverviewQueries(queryClient, groupId),
      ]);
    },
  });
}

export function useUpdateExpense() {
  const queryClient = useQueryClient();
  const { userId, groupId } = useExpenseQueryScope();

  return useMutation<Expense, unknown, { id: number | string; dto: UpdateExpenseDto }>({
    mutationFn: ({ id, dto }) => updateExpense(id, dto),
    onSuccess: async (_data, variables) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: expenseKeys.lists(userId, groupId) }),
        queryClient.invalidateQueries({
          queryKey: expenseKeys.detail(userId, groupId, variables.id),
        }),
        invalidateGroupOverviewQueries(queryClient, groupId),
      ]);
    },
  });
}

export function useDeleteExpense() {
  const queryClient = useQueryClient();
  const { userId, groupId } = useExpenseQueryScope();

  return useMutation<void, unknown, number | string>({
    mutationFn: id => deleteExpense(id),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: expenseKeys.lists(userId, groupId) }),
        invalidateGroupOverviewQueries(queryClient, groupId),
      ]);
    },
  });
}
