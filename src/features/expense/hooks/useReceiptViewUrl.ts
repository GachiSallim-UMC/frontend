import { useQuery } from '@tanstack/react-query';
import { getReceiptViewUrl } from '../api/expense.api';
import { expenseKeys } from '../types/expense.types';
import { useExpenseQueryScope } from './useExpenseQueryScope';

export const useReceiptViewUrl = (expenseId?: number | string) => {
  const { userId, groupId } = useExpenseQueryScope();

  return useQuery({
    queryKey: expenseKeys.receipt(userId, groupId, expenseId ?? 'new'),
    queryFn: () => getReceiptViewUrl(expenseId as number | string),
    enabled: Boolean(userId && groupId && expenseId),
  });
};
