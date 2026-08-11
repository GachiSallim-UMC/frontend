import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createExpense, updateExpense, deleteExpense } from '../api/expense.api';
import type { CreateExpenseDto, UpdateExpenseDto, Expense } from '../types/expense.types';
import { expenseKeys } from './expense.keys';
import { useExpenseQueryScope } from './useExpenseQueryScope';

export function useCreateExpense() {
  const queryClient = useQueryClient();
  const { userId, groupId } = useExpenseQueryScope();

  return useMutation<Expense, unknown, CreateExpenseDto>({
    mutationFn: dto => createExpense(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: expenseKeys.lists(userId, groupId) });
    },
  });
}

export function useUpdateExpense() {
  const queryClient = useQueryClient();
  const { userId, groupId } = useExpenseQueryScope();

  return useMutation<Expense, unknown, { id: number | string; dto: UpdateExpenseDto }>({
    mutationFn: ({ id, dto }) => updateExpense(id, dto),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: expenseKeys.lists(userId, groupId) });
      queryClient.invalidateQueries({
        queryKey: expenseKeys.detail(userId, groupId, variables.id),
      });
    },
  });
}

export function useDeleteExpense() {
  const queryClient = useQueryClient();
  const { userId, groupId } = useExpenseQueryScope();

  return useMutation<void, unknown, number | string>({
    mutationFn: id => deleteExpense(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: expenseKeys.lists(userId, groupId) });
    },
  });
}
