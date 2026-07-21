import React from 'react';
import type { Expense } from '@/features/expense/types/expense.types';

export function useExpenseSummary(expenses: Expense[], currentUserId: string = 'user-1') {
  return React.useMemo(() => {
    const totalExpense = expenses.reduce((acc, cur) => acc + cur.amount, 0);

    let receiveAmount = 0;
    let receiveCount = 0;
    let payAmount = 0;
    let payCount = 0;

    expenses.forEach((exp) => {
      if (exp.payer.id === currentUserId) {
        exp.shares.forEach((share) => {
          if (share.user.id !== currentUserId && !share.isPaid) {
            receiveAmount += share.amount;
            receiveCount += 1;
          }
        });
      } else {
        const myShare = exp.shares.find((share) => share.user.id === currentUserId);
        if (myShare && !myShare.isPaid) {
          payAmount += myShare.amount;
          payCount += 1;
        }
      }
    });

    const uniquePayerCount = new Set(expenses.map((e) => e.payer.id)).size;

    return {
      totalExpense,
      receiveAmount,
      receiveCount,
      payAmount,
      payCount,
      uniquePayerCount,
    };
  }, [expenses, currentUserId]);
}