import React from 'react';
import type { Expense } from '@/features/expense/types/expense.types';

export function useExpenseSummary(expenses: Expense[] = [], currentUserId?: string) {
  return React.useMemo(() => {
    
    if (!Array.isArray(expenses) || expenses.length === 0) {
      return {
        totalExpense: 0,
        receiveAmount: 0,
        receiveCount: 0,
        payAmount: 0,
        payCount: 0,
        uniquePayerCount: 0,
      };
    }

    const totalExpense = expenses.reduce((acc, cur) => acc + (cur.amount || 0), 0);

    let receiveAmount = 0;
    let receiveCount = 0;
    let payAmount = 0;
    let payCount = 0;

    expenses.forEach((exp) => {
     
      const payerId = exp.payer?.id ? String(exp.payer.id) : null;
      const targetUserId = currentUserId ? String(currentUserId) : '';

      if (payerId && payerId === targetUserId) {
        exp.shares?.forEach((share) => {
        
          const shareUserId = share.user?.id ? String(share.user.id) : null;
          if (shareUserId && shareUserId !== targetUserId && !share.isPaid) {
            receiveAmount += share.amount || 0;
            receiveCount += 1;
          }
        });
      } else {
        const myShare = exp.shares?.find((share) => {
          const shareUserId = share.user?.id ? String(share.user.id) : null;
          return shareUserId && shareUserId === targetUserId;
        });

        if (myShare && !myShare.isPaid) {
          payAmount += myShare.amount || 0;
          payCount += 1;
        }
      }
    });

    
    const uniquePayerCount = new Set(
      expenses.map((e) => e.payer?.id).filter(Boolean)
    ).size;

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
