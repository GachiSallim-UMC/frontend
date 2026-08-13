import { useQuery } from '@tanstack/react-query';
import { getReceiptViewUrl } from '@/features/expense/api/expense.api';
import { expenseKeys } from '@/features/expense/hooks/expense.keys';
import { useExpenseQueryScope } from '@/features/expense/hooks/useExpenseQueryScope';

export const useReceiptViewUrl = (expenseId?: number | string) => {
  const { userId, groupId } = useExpenseQueryScope();

  return useQuery({
    queryKey: expenseKeys.receipt(userId, groupId, expenseId ?? 'new'),
    queryFn: () => getReceiptViewUrl(expenseId as number | string),
    enabled: Boolean(userId && groupId && expenseId),
    meta: { skipGlobalError: true },
  });
};
