import type { ExpenseCategory, SettlementMethod } from '@/features/expense/types';
import { isUnsignedIntegerInput, isValidDateOnly } from '@/shared/lib/inputValidation';
import { MAX_EXPENSE_AMOUNT, MEMO_MAX_LENGTH, TODAY_DATE_ONLY } from '@/features/expense/lib/expenseForm.constants';

export type ExpenseFieldErrors = Partial<
  Record<'title' | 'amount' | 'date' | 'payerId' | 'category' | 'members' | 'memo', string>
>;

export interface ExpenseValidationValues {
  title: string;
  amount: string;
  expenseDate: string;
  payerId: string;
  category: ExpenseCategory;
  memo: string;
  checkedMembers: string[];
  settlementMethod: SettlementMethod;
  customMemberAmounts: Record<string, number>;
  customMemberRatios: Record<string, number>;
  isDirectInputCompleted: boolean;
  totalCustomSum: number;
  numericTotalAmount: number;
  totalRatioSum: number;
}

export interface ExpenseValidationResult {
  fieldErrors: ExpenseFieldErrors;
  memberAmountErrors: Record<string, string>;
  memberRatioErrors: Record<string, string>;
}

export const getAmountInputError = (value: string): string | undefined => {
  if (!isUnsignedIntegerInput(value)) return '금액은 숫자만 입력해 주세요.';
  if (value && Number(value) > MAX_EXPENSE_AMOUNT) {
    return `금액은 ${MAX_EXPENSE_AMOUNT.toLocaleString()}원 이하로 입력해 주세요.`;
  }
  return undefined;
};

export const getMemberAmountInputError = (value: string): string | undefined => {
  if (!isUnsignedIntegerInput(value)) return '숫자만 입력해 주세요.';
  if (value && Number(value) > MAX_EXPENSE_AMOUNT) {
    return `${MAX_EXPENSE_AMOUNT.toLocaleString()} 이하로 입력해 주세요.`;
  }
  return undefined;
};

export const getMemberRatioInputError = (value: string): string | undefined => {
  if (!isUnsignedIntegerInput(value)) return '숫자만 입력해 주세요.';
  if (value && Number(value) > 100) return '100 이하로 입력해 주세요.';
  return undefined;
};

const validateMemberInputs = ({
  settlementMethod,
  checkedMembers,
  customMemberAmounts,
  customMemberRatios,
}: ExpenseValidationValues) => {
  const memberAmountErrors: Record<string, string> = {};
  const memberRatioErrors: Record<string, string> = {};

  if (settlementMethod === 'CUSTOM') {
    checkedMembers.forEach(id => {
      const value = customMemberAmounts[id];
      if (value === undefined) {
        memberAmountErrors[id] = '금액을 입력해 주세요.';
      } else if (!Number.isSafeInteger(value) || value < 0 || value > MAX_EXPENSE_AMOUNT) {
        memberAmountErrors[id] =
          `0부터 ${MAX_EXPENSE_AMOUNT.toLocaleString()} 사이의 정수를 입력해 주세요.`;
      }
    });
  }

  if (settlementMethod === 'RATIO') {
    checkedMembers.forEach(id => {
      const value = customMemberRatios[id];
      if (value === undefined) {
        memberRatioErrors[id] = '비율을 입력해 주세요.';
      } else if (!Number.isSafeInteger(value) || value < 0 || value > 100) {
        memberRatioErrors[id] = '0부터 100 사이의 정수를 입력해 주세요.';
      }
    });
  }

  return { memberAmountErrors, memberRatioErrors };
};

const hasMemberErrors = ({
  memberAmountErrors,
  memberRatioErrors,
}: Pick<ExpenseValidationResult, 'memberAmountErrors' | 'memberRatioErrors'>) =>
  Object.keys(memberAmountErrors).length > 0 || Object.keys(memberRatioErrors).length > 0;

export const validateExpenseForm = (values: ExpenseValidationValues): ExpenseValidationResult => {
  const fieldErrors: ExpenseFieldErrors = {};
  const parsedAmount = Number(values.amount);
  const memberErrors = validateMemberInputs(values);

  if (!values.title.trim()) fieldErrors.title = '항목명을 입력해 주세요.';
  else if (values.title.trim().length > 100)
    fieldErrors.title = '항목명은 100자 이하로 입력해 주세요.';

  if (!values.amount) fieldErrors.amount = '금액을 입력해 주세요.';
  else if (
    !Number.isSafeInteger(parsedAmount) ||
    parsedAmount < 1 ||
    parsedAmount > MAX_EXPENSE_AMOUNT
  ) {
    fieldErrors.amount = `금액은 1원부터 ${MAX_EXPENSE_AMOUNT.toLocaleString()}원 사이의 정수로 입력해 주세요.`;
  }

  if (!values.expenseDate) fieldErrors.date = '지출일을 선택해 주세요.';
  else if (!isValidDateOnly(values.expenseDate))
    fieldErrors.date = '올바른 지출일을 선택해 주세요.';
  else if (values.expenseDate > TODAY_DATE_ONLY)
    fieldErrors.date = '지출일은 오늘 또는 이전 날짜로 선택해 주세요.';

  if (!values.payerId) fieldErrors.payerId = '선지불자를 선택해 주세요.';
  if (!values.category) fieldErrors.category = '카테고리를 선택해 주세요.';
  if (values.checkedMembers.length === 0)
    fieldErrors.members = '정산 대상 멤버를 한 명 이상 선택해 주세요.';
  if (values.memo.length > MEMO_MAX_LENGTH)
    fieldErrors.memo = `메모는 ${MEMO_MAX_LENGTH}자 이하로 입력해 주세요.`;

  const needsDirectInput =
    values.settlementMethod === 'CUSTOM' || values.settlementMethod === 'RATIO';
  if (needsDirectInput && hasMemberErrors(memberErrors)) {
    fieldErrors.members = '멤버별 입력값을 확인해 주세요.';
  } else if (
    values.settlementMethod === 'CUSTOM' &&
    values.totalCustomSum !== values.numericTotalAmount
  ) {
    fieldErrors.members = '멤버별 금액 합계가 총금액과 일치해야 합니다.';
  } else if (values.settlementMethod === 'RATIO' && values.totalRatioSum !== 100) {
    fieldErrors.members = '멤버별 비율 합계가 100%여야 합니다.';
  } else if (needsDirectInput && !values.isDirectInputCompleted) {
    fieldErrors.members = '멤버별 금액 또는 비율을 확인한 뒤 완료를 눌러 주세요.';
  }

  return { fieldErrors, ...memberErrors };
};

export const validateDirectInputCompletion = (
  values: ExpenseValidationValues,
): ExpenseValidationResult => {
  const memberErrors = validateMemberInputs(values);
  const fieldErrors: ExpenseFieldErrors = {};

  if (hasMemberErrors(memberErrors)) {
    fieldErrors.members = '멤버별 입력값을 확인해 주세요.';
  } else if (
    values.settlementMethod === 'CUSTOM' &&
    values.totalCustomSum !== values.numericTotalAmount
  ) {
    fieldErrors.members = '멤버별 금액 합계가 총금액과 일치해야 합니다.';
  } else if (values.settlementMethod === 'RATIO' && values.totalRatioSum !== 100) {
    fieldErrors.members = '멤버별 비율 합계가 100%여야 합니다.';
  }

  return { fieldErrors, ...memberErrors };
};
