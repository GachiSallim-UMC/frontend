import { useState, useEffect } from 'react';
import { calculateExpenseSplit } from '@/features/expense/api/expense.api';
import type { SettlementMethod } from '@/features/expense/types';

interface UseSettlementAmountsParams {
  amount: string;
  memberIds: string[];
  settlementMethod: SettlementMethod;
  memberAmounts?: Record<string, number>;
  memberRatios?: Record<string, number>;
}

export function useSettlementAmounts({
  amount,
  memberIds,
  settlementMethod,
  memberAmounts,
  memberRatios,
}: UseSettlementAmountsParams): Record<string, number> {
  const [calculatedAmounts, setCalculatedAmounts] = useState<Record<string, number>>({});

  useEffect(() => {
    let isMounted = true;
    const numericAmount = Number(amount.replace(/,/g, '')) || 0;

    if (numericAmount <= 0 || memberIds.length === 0) {
      setCalculatedAmounts({});
      return;
    }

    if (settlementMethod === 'CUSTOM') {
      const result = memberIds.reduce<Record<string, number>>((acc, id) => {
        acc[id] = memberAmounts?.[id] || 0;
        return acc;
      }, {});
      setCalculatedAmounts(result);
      return;
    }

    if (settlementMethod === 'RATIO') {
      const result = memberIds.reduce<Record<string, number>>((acc, id) => {
        const percentage = memberRatios?.[id] || 0;
        acc[id] = Math.round((numericAmount * percentage) / 100);
        return acc;
      }, {});
      setCalculatedAmounts(result);
      return;
    }

    const fetchSplit = async () => {
      try {
        const response = await calculateExpenseSplit({
          totalAmount: numericAmount,
          splitType: settlementMethod,
          participants: memberIds.map(Number),
        });

        if (isMounted) {
          const splits = response.calculatedSplits ?? [];

          const result: Record<string, number> = splits.reduce(
            (acc: Record<string, number>, split: { userId: string | number; amount: number }) => {
              acc[String(split.userId)] = split.amount;
              return acc;
            },
            {},
          );

          setCalculatedAmounts(result);
        }
      } catch (error) {
        console.error('정산 금액 계산 API 호출 실패:', error);
      }
    };

    fetchSplit();

    return () => {
      isMounted = false;
    };
  }, [amount, memberIds, settlementMethod, memberAmounts, memberRatios]);

  return calculatedAmounts;
}
