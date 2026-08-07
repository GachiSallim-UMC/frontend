import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getExpense } from '@/features/expense';
import type { Expense, ExpenseFilter } from '@/features/expense';
import { expenseKeys } from '@/features/expense';

const isThisMonth = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();

  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth()
  );
};

export function useExpenseList(filter: ExpenseFilter) {
  const {
    data: expenses = [],
    isLoading,
    error,
    refetch,
  } = useQuery<Expense[]>({
    queryKey: expenseKeys.lists(),
    queryFn: async () => {
      return getExpense({});
    },
    staleTime: 0,
  });

  const filteredExpenses = useMemo(() => {
    if (filter === 'THIS_MONTH') {
      return expenses.filter((expense) => isThisMonth(expense.date));
    }

    return expenses;
  }, [expenses, filter]);

  return {
    expenses: filteredExpenses,
    isLoading,
    error: error ? '지출 목록을 불러오지 못했습니다.' : null,
    refetch,
  };
}