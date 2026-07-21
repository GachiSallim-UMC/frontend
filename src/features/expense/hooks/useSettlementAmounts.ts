import React from 'react';

export type SettlementMethod = '균등 분할 (n/n)' | '직접입력';

function calculateEqualSplit(totalAmount: number, memberIds: string[]): Record<string, number> {
  if (memberIds.length === 0) return {};

  const perPerson = Math.floor(totalAmount / memberIds.length);
  const remainder = totalAmount - perPerson * memberIds.length;

  return memberIds.reduce<Record<string, number>>((acc, id, index) => {
    acc[id] = index === memberIds.length - 1 ? perPerson + remainder : perPerson;
    return acc;
  }, {});
}

interface UseSettlementAmountsParams {
  amount: string;
  memberIds: string[];
  settlementMethod: SettlementMethod;
  memberAmounts?: Record<string, number>;
}

export function useSettlementAmounts({
  amount,
  memberIds,
  settlementMethod,
  memberAmounts,
}: UseSettlementAmountsParams): Record<string, number> {
  return React.useMemo(() => {
    const numericAmount = Number(amount.replace(/,/g, '')) || 0;

    switch (settlementMethod) {
      case '균등 분할 (n/n)':
        return calculateEqualSplit(numericAmount, memberIds);
      case '직접입력':
        if (memberAmounts) {
          return memberIds.reduce<Record<string, number>>((acc, id) => {
            acc[id] = memberAmounts[id] || 0;
            return acc;
          }, {});
        }
        return memberIds.reduce<Record<string, number>>((acc, id) => {
          acc[id] = 0;
          return acc;
        }, {});
      default:
        return calculateEqualSplit(numericAmount, memberIds);
    }
  }, [amount, memberIds, settlementMethod, memberAmounts]);
}