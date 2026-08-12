import { useQuery } from '@tanstack/react-query';
import { getExpenseById } from '@/features/expense/api/expense.api';
import { expenseKeys } from '@/features/expense/hooks/expense.keys';
import { useExpenseQueryScope } from '@/features/expense/hooks/useExpenseQueryScope';

export const useExpenseDetail = (expenseId?: string) => {
  const { userId, groupId } = useExpenseQueryScope();

  return useQuery({
    queryKey: expenseKeys.detail(userId, groupId, expenseId ?? 'new'),
    queryFn: () => getExpenseById(expenseId as string),
    enabled: Boolean(userId && groupId && expenseId),
  });
};
