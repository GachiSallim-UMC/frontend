import { useState } from 'react';
import type { ChangeEvent, Dispatch, SetStateAction } from 'react';
import { isDateOnlyInputValue } from '@/shared/lib/inputValidation';
import { useAlertStore } from '@/shared/store';
import { TODAY_DATE_ONLY } from '@/features/expense/lib/expenseForm.constants';
import {
  getAmountInputError,
  getMemberAmountInputError,
  getMemberRatioInputError,
  validateDirectInputCompletion,
  validateExpenseForm,
  type ExpenseFieldErrors,
  type ExpenseValidationValues,
} from '@/features/expense/lib/expenseFormValidation';

interface ExpenseValidationActions {
  setAmount: Dispatch<SetStateAction<string>>;
  setExpenseDate: Dispatch<SetStateAction<string>>;
  setCustomMemberAmounts: Dispatch<SetStateAction<Record<string, number>>>;
  setCustomMemberRatios: Dispatch<SetStateAction<Record<string, number>>>;
  setIsDirectInputCompleted: Dispatch<SetStateAction<boolean>>;
}

interface UseExpenseFormValidationProps {
  values: ExpenseValidationValues;
  actions: ExpenseValidationActions;
}

export const useExpenseFormValidation = ({ values, actions }: UseExpenseFormValidationProps) => {
  const [fieldErrors, setFieldErrors] = useState<ExpenseFieldErrors>({});
  const [memberAmountErrors, setMemberAmountErrors] = useState<Record<string, string>>({});
  const [memberRatioErrors, setMemberRatioErrors] = useState<Record<string, string>>({});

  const clearFieldError = (field: keyof ExpenseFieldErrors) => {
    setFieldErrors(previous => ({ ...previous, [field]: undefined }));
  };

  const clearMemberInputErrors = () => {
    setMemberAmountErrors({});
    setMemberRatioErrors({});
  };

  const applyValidationResult = ({
    fieldErrors: nextFieldErrors,
    memberAmountErrors: nextAmountErrors,
    memberRatioErrors: nextRatioErrors,
  }: ReturnType<typeof validateExpenseForm>) => {
    setFieldErrors(nextFieldErrors);
    setMemberAmountErrors(nextAmountErrors);
    setMemberRatioErrors(nextRatioErrors);
    return Object.keys(nextFieldErrors).length === 0;
  };

  const applyDirectInputResult = ({
    fieldErrors: nextFieldErrors,
    memberAmountErrors: nextAmountErrors,
    memberRatioErrors: nextRatioErrors,
  }: ReturnType<typeof validateDirectInputCompletion>) => {
    setFieldErrors(previous => ({
      ...previous,
      members: nextFieldErrors.members,
    }));
    setMemberAmountErrors(nextAmountErrors);
    setMemberRatioErrors(nextRatioErrors);
    return !nextFieldErrors.members;
  };

  const handleDateChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!isDateOnlyInputValue(event.currentTarget.value)) return;
    actions.setExpenseDate(event.currentTarget.value);
    clearFieldError('date');
  };

  const handleDateBlur = () => {
    if (values.expenseDate && values.expenseDate > TODAY_DATE_ONLY) {
      actions.setExpenseDate(TODAY_DATE_ONLY);
      useAlertStore.getState().showAlert({
        title: '알림',
        message: '오늘 이후의 날짜는 선택할 수 없습니다.',
      });
    }
  };

  const handleAmountChange = (value: string) => {
    const error = getAmountInputError(value);
    if (error) {
      setFieldErrors(previous => ({ ...previous, amount: error }));
      return;
    }

    actions.setAmount(value);
    clearFieldError('amount');
    if (values.settlementMethod !== 'EQUAL') actions.setIsDirectInputCompleted(false);
  };

  const handleMemberAmountChange = (userId: string, input: string) => {
    const error = getMemberAmountInputError(input);
    if (error) {
      setMemberAmountErrors(previous => ({ ...previous, [userId]: error }));
      return;
    }

    actions.setCustomMemberAmounts(previous => {
      const next = { ...previous };
      if (input === '') delete next[userId];
      else next[userId] = Number(input);
      return next;
    });
    setMemberAmountErrors(previous => {
      const next = { ...previous };
      delete next[userId];
      return next;
    });
    clearFieldError('members');
  };

  const handleMemberRatioChange = (userId: string, input: string) => {
    const error = getMemberRatioInputError(input);
    if (error) {
      setMemberRatioErrors(previous => ({ ...previous, [userId]: error }));
      return;
    }

    actions.setCustomMemberRatios(previous => {
      const next = { ...previous };
      if (input === '') delete next[userId];
      else next[userId] = Number(input);
      return next;
    });
    setMemberRatioErrors(previous => {
      const next = { ...previous };
      delete next[userId];
      return next;
    });
    clearFieldError('members');
  };

  const validateForm = () => applyValidationResult(validateExpenseForm(values));

  const completeDirectInput = () => {
    const result = validateDirectInputCompletion(values);
    if (!applyDirectInputResult(result)) return;
    actions.setIsDirectInputCompleted(true);
  };

  return {
    fieldErrors,
    memberAmountErrors,
    memberRatioErrors,
    clearFieldError,
    clearMemberInputErrors,
    handleDateChange,
    handleDateBlur,
    handleAmountChange,
    handleMemberAmountChange,
    handleMemberRatioChange,
    validateForm,
    completeDirectInput,
  };
};
