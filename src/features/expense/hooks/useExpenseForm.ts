import React from 'react';
import type { Expense } from '@/features/expense/types/expense.types';
import type { SettlementMethod } from '@/features/expense/hooks/useSettlementAmounts';

interface UseExpenseFormProps {
  initialExpense?: Expense;
  selectedPayerId?: string;
  mockUsers: { id: string; name: string; avatarUrl?: string }[];
  onSave?: (newExpense: Expense) => void;
}

export function useExpenseForm({
  initialExpense,
  selectedPayerId = '',
  mockUsers,
  onSave,
}: UseExpenseFormProps) {
  const [title, setTitle] = React.useState(initialExpense?.title || '');
  const [amount, setAmount] = React.useState(initialExpense ? initialExpense.amount.toLocaleString() : '');
  const [checkedMembers, setCheckedMembers] = React.useState<string[]>(
    initialExpense ? initialExpense.shares.map((s) => s.user.id) : mockUsers.map((u) => u.id)
  );
  const [settlementMethod, setSettlementMethod] = React.useState<SettlementMethod>('균등 분할 (n/n)');
  const [category, setCategory] = React.useState<string>(initialExpense?.category || 'food');
  const [memo, setMemo] = React.useState(initialExpense?.memo || '');
  const [expenseDate, setExpenseDate] = React.useState(initialExpense?.date || '');
  const [payerId, setPayerId] = React.useState(initialExpense?.payer.id || selectedPayerId);

  const [customMemberAmounts, setCustomMemberAmounts] = React.useState<Record<string, number>>(() => {
    if (!initialExpense) return {};
    return initialExpense.shares.reduce<Record<string, number>>((acc, s) => {
      acc[s.user.id] = s.amount;
      return acc;
    }, {});
  });
  
  const [isDirectInputCompleted, setIsDirectInputCompleted] = React.useState(!!initialExpense);
  const [warningMessage, setWarningMessage] = React.useState<string | null>(null);

  const dateInputRef = React.useRef<HTMLInputElement>(null);

  const handleMethodChange = (newMethod: SettlementMethod) => {
    setSettlementMethod(newMethod);
    setIsDirectInputCompleted(false);
    setWarningMessage(null);
  };

  const toggleMember = (id: string) => {
    setCheckedMembers((prev) =>
      prev.includes(id) ? prev.filter((memberId) => memberId !== id) : [...prev, id]
    );
  };

  const handleIconClick = () => {
    dateInputRef.current?.showPicker?.();
  };

  const numericTotalAmount = Number(amount.replace(/,/g, '')) || 0;
  const totalCustomSum = Object.values(customMemberAmounts).reduce((acc, cur) => acc + cur, 0);

  const handleCompleteDirectInput = () => {
    if (totalCustomSum > numericTotalAmount) {
      setWarningMessage('입력된 금액이 총액을 초과했습니다.');
      return;
    }
    if (totalCustomSum < numericTotalAmount) {
      setWarningMessage('입력된 금액이 총액보다 부족합니다.');
      return;
    }
    setWarningMessage(null);
    setIsDirectInputCompleted(true);
  };

  const handleSaveClick = () => {
    if (!title || !numericTotalAmount || !payerId || !expenseDate) {
      alert('필수 정보를 모두 입력해주세요.');
      return;
    }

    const newExpense: Expense = {
      id: String(Date.now()),
      title,
      amount: numericTotalAmount,
      date: expenseDate,
      payer: mockUsers.find((u) => u.id === payerId) || mockUsers[0],
      splitType: settlementMethod === '직접입력' ? 'ratio' : 'equal',
      category: category as any,
      status: 'unpaid',
      shares: checkedMembers.map((memberId) => {
        const user = mockUsers.find((u) => u.id === memberId)!;
        return {
          user: user as any,
          amount: settlementMethod === '직접입력' 
            ? (customMemberAmounts[memberId] || 0) 
            : Math.floor(numericTotalAmount / checkedMembers.length),
          isPaid: false,
        };
      }),
      memo,
    };

    onSave?.(newExpense);
  };

  return {
    title,
    setTitle,
    amount,
    setAmount,
    checkedMembers,
    toggleMember,
    settlementMethod,
    handleMethodChange,
    category,
    setCategory,
    memo,
    setMemo,
    expenseDate,
    setExpenseDate,
    payerId,
    setPayerId,
    customMemberAmounts,
    setCustomMemberAmounts,
    isDirectInputCompleted,
    setIsDirectInputCompleted,
    warningMessage,
    setWarningMessage,
    dateInputRef,
    handleIconClick,
    numericTotalAmount,
    totalCustomSum,
    handleCompleteDirectInput,
    handleSaveClick,
  };
}