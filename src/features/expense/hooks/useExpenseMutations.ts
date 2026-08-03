import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createExpense, updateExpense, deleteExpense } from '@/features/expense';
import type {
  CreateExpenseDto,
  UpdateExpenseDto,
  Expense,
} from '@/features/expense';
import { expenseKeys } from '@/features/expense';

export function useCreateExpense() {
  const queryClient = useQueryClient();

  return useMutation<Expense, unknown, CreateExpenseDto>({
    mutationFn: (dto) => createExpense(dto),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: expenseKeys.lists() });
    },
  });
}

export function useUpdateExpense() {
  const queryClient = useQueryClient();

  return useMutation<
    Expense,
    unknown,
    { id: number | string; dto: UpdateExpenseDto }
  >({
    mutationFn: ({ id, dto }) => updateExpense(id, dto),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: expenseKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: expenseKeys.detail(variables.id),
      });
    },
  });
}

export function useDeleteExpense() {
  const queryClient = useQueryClient();

  return useMutation<void, unknown, number | string>({
    mutationFn: (id) => deleteExpense(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: expenseKeys.lists() });
    },
  });
}