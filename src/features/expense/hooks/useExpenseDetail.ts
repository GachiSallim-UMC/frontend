import { useQuery } from '@tanstack/react-query';
import { getExpenseById } from '../api/expense.api';
import { expenseKeys } from './expense.keys';
import { useExpenseQueryScope } from './useExpenseQueryScope';

export const useExpenseDetail = (expenseId?: string) => {
  const { userId, groupId } = useExpenseQueryScope();

  return useQuery({
    queryKey: expenseKeys.detail(userId, groupId, expenseId ?? 'new'),
    queryFn: () => getExpenseById(expenseId as string),
    enabled: Boolean(userId && groupId && expenseId),
  });
};
