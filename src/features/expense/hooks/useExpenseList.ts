import { useState, useEffect, useMemo } from 'react';
import { getExpense } from '@/features/expense';
import type { Expense } from '@/features/expense';
import type { ExpenseFilter } from '@/features/expense';

const isThisMonth = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth();
};

export function useExpenseList(filter: ExpenseFilter) {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const removeExpense = (id: number | string) => {
    setExpenses(prev => prev.filter(expense => expense.id !== id));
  };
  useEffect(() => {
    let isMounted = true;

    const fetchExpenses = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getExpense({});
        if (isMounted) setExpenses(data);
      } catch (err) {
        if (isMounted) setError('지출 목록을 불러오지 못했습니다.');
        console.error('지출 목록 조회 실패:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchExpenses();
    return () => {
      isMounted = false;
    };
  }, []);

  const filteredExpenses = useMemo(() => {
    if (filter === 'THIS_MONTH') {
      return expenses.filter((expense) => isThisMonth(expense.date));
    }
    return expenses;
  }, [expenses, filter]);

  return { expenses: filteredExpenses, isLoading, error, removeExpense };
}