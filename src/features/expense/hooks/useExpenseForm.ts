import { useState, useRef, useEffect } from 'react';
import type { CreateExpenseDto, UpdateExpenseDto, Expense, ExpenseCategory } from '@/features/expense';
import type { SettlementMethod } from '@/features/expense';
import { useCreateExpense, useUpdateExpense } from '@/features/expense';


interface UseExpenseFormProps {
  initialExpense?: Expense;
  selectedPayerId?: string;
  mockUsers: { id: string; name: string; avatarUrl?: string }[];
  onSave?: (newExpense: Expense) => void;
  isEditMode?: boolean;
  expenseId?: string;
  receiptUrl?: string;
}

export function useExpenseForm({
  initialExpense,
  selectedPayerId = '',
  mockUsers,
  onSave,
  isEditMode = false,
  expenseId,
  receiptUrl,
}: UseExpenseFormProps) {
  const [title, setTitle] = useState(initialExpense?.title || '');
  const [amount, setAmount] = useState(
    initialExpense?.amount ? String(Number(initialExpense.amount)) : ''
  );
  const [checkedMembers, setCheckedMembers] = useState<string[]>(
    initialExpense?.shares ? initialExpense.shares.map((s) => s.user.id) : mockUsers.map((u) => u.id)
  );
  const [settlementMethod, setSettlementMethod] = useState<SettlementMethod>(initialExpense?.splitType || 'EQUAL');
  const [category, setCategory] = useState<ExpenseCategory>(initialExpense?.category || 'FOOD');
  const [memo, setMemo] = useState(initialExpense?.memo || '');
  const [expenseDate, setExpenseDate] = useState(
    initialExpense?.date ? initialExpense.date.slice(0, 10) : ''
  );
  const [payerId, setPayerId] = useState(initialExpense?.payer.id || selectedPayerId);

  const [customMemberAmounts, setCustomMemberAmounts] = useState<Record<string, number>>(() => {
    if (!initialExpense?.shares) return {};
    return initialExpense.shares.reduce<Record<string, number>>((acc, s) => {
      acc[s.user.id] = s.amount;
      return acc;
    }, {});
  });

  const [customMemberRatios, setCustomMemberRatios] = useState<Record<string, number>>({});

  const [isDirectInputCompleted, setIsDirectInputCompleted] = useState(!!initialExpense);
  const [warningMessage, setWarningMessage] = useState<string | null>(null);

  const dateInputRef = useRef<HTMLInputElement>(null);

  const { mutateAsync: createExpenseAsync } = useCreateExpense();
  const { mutateAsync: updateExpenseAsync } = useUpdateExpense();

  useEffect(() => {
    if (!initialExpense && mockUsers.length > 0) {
      setCheckedMembers(mockUsers.map((u) => u.id));
    }
  }, [mockUsers, initialExpense]);

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
  const totalCustomSum = checkedMembers.reduce(
    (sum, memberId) => sum + (customMemberAmounts[memberId] ?? 0),
    0,
  );
  const totalRatioSum = checkedMembers.reduce(
    (sum, memberId) => sum + (customMemberRatios[memberId] ?? 0),
    0,
  );

  const handleCompleteDirectInput = () => {
    if (settlementMethod === 'RATIO') {
      if (totalRatioSum > 100) {
        setWarningMessage('입력된 비율의 합이 100%를 초과했습니다.');
        return;
      }
      if (totalRatioSum < 100) {
        setWarningMessage('입력된 비율의 합이 100%보다 부족합니다.');
        return;
      }
    } else {
      if (totalCustomSum > numericTotalAmount) {
        setWarningMessage('입력된 금액이 총액을 초과했습니다.');
        return;
      }
      if (totalCustomSum < numericTotalAmount) {
        setWarningMessage('입력된 금액이 총액보다 부족합니다.');
        return;
      }
    }
    setWarningMessage(null);
    setIsDirectInputCompleted(true);
  };

  const handleSaveClick = async () => {
    try {
      const formattedDate = expenseDate.replace(/\//g, '-');

      const targetMemberIds =
        settlementMethod === 'CUSTOM'
          ? checkedMembers.map((id) => ({
              userId: id,
              amount: customMemberAmounts[id] || 0,
            }))
          : settlementMethod === 'RATIO'
          ? checkedMembers.map((id) => ({
              userId: id,
              percentage: customMemberRatios[id] || 0,
            }))
          : checkedMembers.map((id) => ({ userId: id }));

      let savedExpense: Expense;

      if (isEditMode && expenseId) {
        const updatePayload: UpdateExpenseDto = {
          title,
          totalAmount: numericTotalAmount,
          category,
          splitType: settlementMethod,
        };

        if (settlementMethod !== 'EQUAL') {
          updatePayload.targetMemberIds = targetMemberIds;
        }

        if (receiptUrl) {
          updatePayload.receiptUrl = receiptUrl;
        }

        savedExpense = await updateExpenseAsync({ id: expenseId, dto: updatePayload });
      } else {
        const createPayload: CreateExpenseDto = {
          title,
          amount: numericTotalAmount,
          date: formattedDate,
          payerId,
          category,
          splitType: settlementMethod,
          targetMemberIds,
          memo,
          receiptUrl: receiptUrl ?? '',
        };
        savedExpense = await createExpenseAsync(createPayload);
      }

      // 완료 알림 모달은 띄우지 않는다. (Figma "공통 모달 C(R)UD 모달" 주석:
      // "~가 등록되었습니다" 와 같은 확인 모달 사용 X)
      onSave?.(savedExpense);
    } catch (error) {
      console.error(isEditMode ? '지출 수정 실패:' : '지출 등록 실패:', error);
      // 호출부가 확인 모달 안에 사유를 표시할 수 있도록 그대로 전달한다.
      throw error;
    }
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
    customMemberRatios,
    setCustomMemberRatios,
    totalRatioSum,
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
