import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getExpense, getExpenseById } from '@/features/expense';
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
  } = useQuery<Expense[]>({
    queryKey: expenseKeys.lists(),
    queryFn: async () => {
      const list = await getExpense({});

      const expensesWithDetails = await Promise.all(
        list.map(async (expense) => {
          try {
            return await getExpenseById(expense.id);
          } catch (error) {
            console.error(`지출 상세 조회 실패: ${expense.id}`, error);
            return expense;
          }
        })
      );

      return expensesWithDetails;
    },
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
  };
}