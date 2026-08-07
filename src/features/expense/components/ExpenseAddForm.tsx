import React, { useState, useEffect } from 'react';
import calendarIcon from '@/assets/icons/expense/calendar.svg';
import ExpenseIcon from '@/assets/icons/sidebar/expenses.svg?react';
import {
  useSettlementAmounts,
  useExpenseForm,
  ExpenseSaveModal,
  ExpenseCancelModal,
  ExpenseDeleteModal,
  AlertModal,
} from '@/features/expense';
import type { SettlementMethod } from '@/features/expense';
import type { Expense, ExpenseCategory } from '@/features/expense';
import type { User } from '@/shared/types';
import { FormInput, SelectDropdown, TextArea } from '@/shared/components/form';
import { ShareMessengerButton, Button } from '@/shared/components/';
import {
  isDateOnlyInputValue,
  isUnsignedIntegerInput,
  isValidDateOnly,
} from '@/shared/lib/inputValidation';

const labelClass = 'font-sans text-caption font-bold text-gray-800';


const cardClass =
  'w-full bg-white p-3 rounded-[16px] flex flex-col gap-5 lg:p-[32px] border border-gray-100';

const toLocalDateOnly = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const todayStr = toLocalDateOnly(new Date());
const RequiredMark = () => '*';
const MEMO_MAX_LENGTH = 255;
const MAX_EXPENSE_AMOUNT = 2_147_483_647;

type ExpenseFieldErrors = Partial<
  Record<
    'title' | 'amount' | 'date' | 'payerId' | 'category' | 'members' | 'memo', string
  >
>;

interface AlertState {
  title: string;
  description: string;
}

const CATEGORY_OPTIONS = [
  { value: 'FINANCE', label: '세금/기타금융' },
  { value: 'FOOD', label: '식비' },
  { value: 'SHOPPING', label: '쇼핑' },
  { value: 'EDUCATION', label: '교육' },
  { value: 'GROCERY', label: '편의점/마트/잡화' },
  { value: 'TRANSPORT', label: '교통/자동차' },
  { value: 'LEISURE', label: '취미/여가' },
  { value: 'CAFE', label: '카페/간식' },
  { value: 'UTILITIES', label: '공과금/생활' },
  { value: 'ETC', label: '기타' },
] as const;

const SPLIT_METHOD_OPTIONS = [
  { value: 'EQUAL', label: '균등 분할 (n/n)' },
  { value: 'CUSTOM', label: '직접 입력' },
  { value: 'RATIO', label: '비율 분할 (%)' },
] as const;

function formatWon(value: number): string {
  return `${value.toLocaleString()}원`;
}

interface ExpenseAddFormProps {
  members: User[];
  membersLoading?: boolean;
  selectedPayerId?: string;
  onPayerChange?: (id: string) => void;
  memberAmounts?: Record<string, number>;
  initialExpense?: Expense;
  onSave?: (newExpense: Expense) => void;
  onCancel?: () => void;
  isEditMode?: boolean;
  expenseId?: string;
  receiptUrl?: string;
  onShare?: (expenseId: string) => void;
  isSharing?: boolean;
  onDelete?: (expenseId: string) => Promise<void> | void;
  isDeleting?: boolean;
}

export const ExpenseAddForm = ({
  members,
  membersLoading,
  selectedPayerId = '',
  onPayerChange,
  memberAmounts,
  initialExpense,
  onSave,
  onCancel,
  isEditMode = false,
  expenseId,
  receiptUrl,
  onShare,
  isSharing,
  onDelete,
  isDeleting,
}: ExpenseAddFormProps) => {
  const [currentExpenseId, setCurrentExpenseId] = useState<string | undefined>(expenseId);
  const [fieldErrors, setFieldErrors] = useState<ExpenseFieldErrors>({});
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveErrorMessage, setSaveErrorMessage] = useState<string | undefined>(undefined);
  const [deleteErrorMessage, setDeleteErrorMessage] = useState<string | undefined>(undefined);
  const [memberAmountErrors, setMemberAmountErrors] = useState<Record<string, string>>({});
  const [memberRatioErrors, setMemberRatioErrors] = useState<Record<string, string>>({});
  const [alertState, setAlertState] = useState<AlertState | null>(null);

  const isSettled = isEditMode && initialExpense?.status === 'paid';

  useEffect(() => {
    setCurrentExpenseId(expenseId);
  }, [expenseId]);

  const handleFormSave = (newExpense: Expense) => {
    setCurrentExpenseId(String(newExpense.id));
    onSave?.(newExpense);
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isDateOnlyInputValue(e.currentTarget.value)) return;
    setExpenseDate(e.currentTarget.value);
    setFieldErrors(previous => ({ ...previous, date: undefined }));
  };

  const handleDateBlur = () => {
    if (expenseDate && expenseDate < todayStr) {
      setExpenseDate(todayStr);
      setAlertState({
        title: '알림',
        description: '오늘 이전의 날짜는 선택할 수 없습니다.',
      });
    }
  };

  const {
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
  } = useExpenseForm({
    initialExpense,
    selectedPayerId,
    mockUsers: members,
    onSave: handleFormSave,
    isEditMode,
    expenseId,
    receiptUrl,
  });

  const settlementAmounts = useSettlementAmounts({
    amount,
    memberIds: checkedMembers,
    settlementMethod,
    memberAmounts: memberAmounts || customMemberAmounts,
    memberRatios: customMemberRatios,
  });

  const handlePayerSelect = (value: string) => {
    setPayerId(value);
    setFieldErrors(previous => ({ ...previous, payerId: undefined }));
    onPayerChange?.(value);
  };

  const handleAmountChange = (value: string) => {
    if (!isUnsignedIntegerInput(value)) {
      setFieldErrors(previous => ({
        ...previous,
        amount: '금액은 숫자만 입력해 주세요.',
      }));
      return;
    }

    if (value && Number(value) > MAX_EXPENSE_AMOUNT) {
      setFieldErrors(previous => ({
        ...previous,
        amount: `금액은 ${MAX_EXPENSE_AMOUNT.toLocaleString()}원 이하로 입력해 주세요.`,
      }));
      return;
    }

    setAmount(value);
    setFieldErrors(previous => ({ ...previous, amount: undefined }));

    if (settlementMethod !== 'EQUAL') {
      setIsDirectInputCompleted(false);
    }
  };

  const handleSaveClickWithGuard = async () => {
    if (isSettled) {
      setAlertState({
        title: '알림',
        description: '정산 완료된 내역은 수정할 수 없습니다.',
      });
      return;
    }

    await handleSaveClick();
  };

  const isCustom = settlementMethod === 'CUSTOM';
  const isRatio = settlementMethod === 'RATIO';

  const validateMemberInputs = () => {
    const nextAmountErrors: Record<string, string> = {};
    const nextRatioErrors: Record<string, string> = {};

    if (isCustom) {
      checkedMembers.forEach(id => {
        const value = customMemberAmounts[id];

        if (value === undefined) {
          nextAmountErrors[id] = '금액을 입력해 주세요.';
        } else if (
          !Number.isSafeInteger(value) ||
          value < 0 ||
          value > MAX_EXPENSE_AMOUNT
        ) {
          nextAmountErrors[id] =
            `0부터 ${MAX_EXPENSE_AMOUNT.toLocaleString()} 사이의 정수를 입력해 주세요.`;
        }
      });
    }

    if (isRatio) {
      checkedMembers.forEach(id => {
        const value = customMemberRatios[id];

        if (value === undefined) {
          nextRatioErrors[id] = '비율을 입력해 주세요.';
        } else if (
          !Number.isSafeInteger(value) ||
          value < 0 ||
          value > 100
        ) {
          nextRatioErrors[id] = '0부터 100 사이의 정수를 입력해 주세요.';
        }
      });
    }

    setMemberAmountErrors(nextAmountErrors);
    setMemberRatioErrors(nextRatioErrors);

    return (
      Object.keys(nextAmountErrors).length === 0 &&
      Object.keys(nextRatioErrors).length === 0
    );
  };

  const validateForm = () => {
    const nextErrors: ExpenseFieldErrors = {};
    const parsedAmount = Number(amount);

    if (!title.trim()) {
      nextErrors.title = '항목명을 입력해 주세요.';
    } else if (title.trim().length > 100) {
      nextErrors.title = '항목명은 100자 이하로 입력해 주세요.';
    }

    if (!amount) {
      nextErrors.amount = '금액을 입력해 주세요.';
    } else if (
      !Number.isSafeInteger(parsedAmount) ||
      parsedAmount < 1 ||
      parsedAmount > MAX_EXPENSE_AMOUNT
    ) {
      nextErrors.amount =
        `금액은 1원부터 ${MAX_EXPENSE_AMOUNT.toLocaleString()}원 사이의 정수로 입력해 주세요.`;
    }

    if (!expenseDate) {
      nextErrors.date = '지출일을 선택해 주세요.';
    } else if (!isValidDateOnly(expenseDate)) {
      nextErrors.date = '올바른 지출일을 선택해 주세요.';
    } else if (expenseDate < todayStr) {
      nextErrors.date = '지출일은 오늘 이후로 선택해 주세요.';
    }

    if (!payerId) nextErrors.payerId = '선지불자를 선택해 주세요.';
    if (!category) nextErrors.category = '카테고리를 선택해 주세요.';

    if (checkedMembers.length === 0) {
      nextErrors.members = '정산 대상 멤버를 한 명 이상 선택해 주세요.';
    }

    if (memo.length > MEMO_MAX_LENGTH) {
      nextErrors.memo = `메모는 ${MEMO_MAX_LENGTH}자 이하로 입력해 주세요.`;
    }

    const areMemberInputsValid = validateMemberInputs();

    if ((isCustom || isRatio) && !areMemberInputsValid) {
      nextErrors.members = '멤버별 입력값을 확인해 주세요.';
    } else if ((isCustom || isRatio) && !isDirectInputCompleted) {
      nextErrors.members =
        '멤버별 금액 또는 비율을 확인한 뒤 완료를 눌러 주세요.';
    }

    setFieldErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  };

  const handleCompleteDirectInputWithValidation = () => {
    if (!validateMemberInputs()) {
      setFieldErrors(previous => ({
        ...previous,
        members: '멤버별 입력값을 확인해 주세요.',
      }));
      return;
    }

    if (isCustom && totalCustomSum !== numericTotalAmount) {
      setFieldErrors(previous => ({
        ...previous,
        members: '멤버별 금액 합계가 총금액과 일치해야 합니다.',
      }));
      return;
    }

    if (isRatio && totalRatioSum !== 100) {
      setFieldErrors(previous => ({
        ...previous,
        members: '멤버별 비율 합계가 100%여야 합니다.',
      }));
      return;
    }

    setFieldErrors(previous => ({ ...previous, members: undefined }));
    handleCompleteDirectInput();
  };

  const handleSaveClickWithFieldValidation = () => {
    if (!validateForm()) return;

    setSaveErrorMessage(undefined);
    setIsSaveModalOpen(true);
  };

  const handleConfirmSave = async () => {
    setIsSaving(true);

    try {
      await handleSaveClickWithGuard();
      setIsSaveModalOpen(false);
    } catch (error) {
      setSaveErrorMessage(
        error instanceof Error
          ? error.message
          : isEditMode
            ? '지출 수정 중 오류가 발생했습니다.'
            : '지출 등록 중 오류가 발생했습니다.',
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelClick = () => {
    setIsCancelModalOpen(true);
  };

  const handleConfirmCancel = () => {
    setIsCancelModalOpen(false);
    onCancel?.();
  };

  const handleDeleteClick = () => {
    setDeleteErrorMessage(undefined);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!currentExpenseId) return;

    try {
      await onDelete?.(currentExpenseId);
      setIsDeleteModalOpen(false);
    } catch (error) {
      setDeleteErrorMessage(
        error instanceof Error
          ? error.message
          : '지출 삭제 중 오류가 발생했습니다.',
      );
    }
  };

  return (
    <>
      {isSettled && (
        <div className="mb-4 rounded-lg bg-gray-100 px-4 py-3 text-caption text-gray-600">
          정산이 완료된 내역이라 수정할 수 없습니다.
        </div>
      )}

      <fieldset
        disabled={isSettled}
        className={`flex w-full flex-col gap-4 sm:gap-6 ${isSettled ? 'opacity-60' : ''}`}
      >
        <div className={cardClass}>
          <h2 className="font-sans text-body font-bold text-gray-800">
            기본 정보
          </h2>

          <FormInput
            label="항목명"
            required
            value={title}
            onChange={e => {
              setTitle(e.target.value);
              setFieldErrors(previous => ({
                ...previous,
                title: undefined,
              }));
            }}
            maxLength={100}
            placeholder="예: 마트 장보기, 전기요금"
            error={fieldErrors.title}
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormInput
              label="금액"
              required
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={10}
              value={amount}
              onChange={e => handleAmountChange(e.target.value)}
              placeholder="0"
              error={fieldErrors.amount}
            />

            <div className="flex flex-col gap-2">
              <label htmlFor="expense-date" className={labelClass}>
                지출일 <RequiredMark />
              </label>

              <div className="relative">
                <input
                  id="expense-date"
                  ref={dateInputRef}
                  type="date"
                  value={expenseDate}
                  onChange={handleDateChange}
                  onBlur={handleDateBlur}
                  min={todayStr}
                  placeholder="yyyy-mm-dd"
                  className={`h-[50px] w-full rounded-[8px] border bg-white px-4 pr-12 text-button text-gray-800 outline-none placeholder:text-gray-400 focus:bg-white focus:ring-2 focus:ring-primary-500 [&::-webkit-calendar-picker-indicator]:hidden ${
                    fieldErrors.date ? 'border-red-500' : 'border-gray-100'
                  }`}
                />

                <button
                  type="button"
                  onClick={handleIconClick}
                  aria-label="달력 열기"
                  className="absolute right-4 top-1/2 flex h-6 w-6 -translate-y-1/2 cursor-pointer items-center justify-center"
                >
                  <img src={calendarIcon} alt="" />
                </button>
              </div>

              {fieldErrors.date && (
                <p className="mt-1.5 text-xs text-red-500">
                  {fieldErrors.date}
                </p>
              )}
            </div>
          </div>

          <SelectDropdown
            label="선지불자"
            required
            value={payerId}
            onChange={handlePayerSelect}
            options={members.map(payer => ({
              value: String(payer.id),
              label: payer.name,
            }))}
            placeholder={
              membersLoading ? '멤버 불러오는 중...' : '선지불자 선택'
            }
            error={fieldErrors.payerId}
            disabled={membersLoading}
          />

          <SelectDropdown
            label="카테고리"
            required
            value={category}
            onChange={v => {
              setCategory(v as ExpenseCategory);
              setFieldErrors(previous => ({
                ...previous,
                category: undefined,
              }));
            }}
            options={CATEGORY_OPTIONS}
            placeholder=""
            error={fieldErrors.category}
          />
        </div>

        <div className={cardClass}>
          <h2 className="font-sans text-body font-bold text-gray-800">
            정산 방식
          </h2>

          <SelectDropdown
            label="분담 방식"
            required
            value={settlementMethod}
            onChange={v => {
              handleMethodChange(v as SettlementMethod);
              setFieldErrors(previous => ({
                ...previous,
                members: undefined,
              }));
              setMemberAmountErrors({});
              setMemberRatioErrors({});
            }}
            options={SPLIT_METHOD_OPTIONS}
            placeholder=""
          />

          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <label className={labelClass}>
                정산 대상 멤버 <RequiredMark />
              </label>

              {(isCustom || isRatio) && !isDirectInputCompleted && (
                <div className="flex flex-wrap items-center gap-3">
                  {isRatio ? (
                    <span className="text-caption text-gray-600">
                      합계:{' '}
                      <strong className="text-gray-800">
                        {totalRatioSum}%
                      </strong>{' '}
                      / 100%
                    </span>
                  ) : (
                    <span className="text-caption text-gray-600">
                      합계:{' '}
                      <strong className="text-gray-800">
                        {formatWon(totalCustomSum)}
                      </strong>{' '}
                      / 총액: {formatWon(numericTotalAmount)}
                    </span>
                  )}

                  <button
                    type="button"
                    onClick={handleCompleteDirectInputWithValidation}
                    className="rounded bg-gray-800 px-3 py-1 text-caption font-bold text-white hover:bg-gray-700"
                  >
                    완료
                  </button>
                </div>
              )}

              {(isCustom || isRatio) && isDirectInputCompleted && (
                <button
                  type="button"
                  onClick={() => setIsDirectInputCompleted(false)}
                  className="rounded border border-gray-300 px-3 py-1 text-caption text-gray-700 hover:bg-gray-50"
                >
                  수정하기
                </button>
              )}
            </div>

            {warningMessage && (
              <div className="flex w-full items-center justify-between px-4 py-2 text-caption font-bold text-orange-700">
                <span>{warningMessage}</span>
                <button
                  onClick={() => setWarningMessage(null)}
                  className="font-bold text-orange-700"
                >
                  ✕
                </button>
              </div>
            )}

            <div
              className={`flex flex-col gap-1.5 rounded-lg ${
                fieldErrors.members
                  ? 'border border-red-500 p-2'
                  : ''
              }`}
            >
              {membersLoading ? (
                <div className="py-2 text-caption text-gray-400">
                  멤버 목록을 불러오는 중...
                </div>
              ) : (
                members.map(user => (
                  <div
                    key={user.id}
                    className="flex min-h-[28px] items-center justify-between text-button text-gray-800"
                  >
                    <div className="flex w-full flex-wrap items-center gap-2">
                      <label
                        htmlFor={`member-${user.id}`}
                        className="flex cursor-pointer items-center gap-2 font-normal text-button text-gray-800"
                      >
                        <input
                          id={`member-${user.id}`}
                          type="checkbox"
                          checked={checkedMembers.includes(user.id)}
                          onChange={() => {
                            toggleMember(user.id);
                            setFieldErrors(previous => ({
                              ...previous,
                              members: undefined,
                            }));
                          }}
                          className="h-4 w-4 rounded border-gray-100 accent-gray-800"
                        />
                        <span>{user.name}</span>
                      </label>

                      {settlementMethod === 'EQUAL' && (
                        <span className="font-normal text-button text-gray-800">
                          - {formatWon(settlementAmounts[user.id] ?? 0)}
                        </span>
                      )}

                      {isCustom &&
                        checkedMembers.includes(user.id) &&
                        !isDirectInputCompleted && (
                          <div className="ml-2 flex items-center gap-2">
                            <span className="font-normal text-button text-gray-800">
                              -
                            </span>

                            <input
                              type="text"
                              inputMode="numeric"
                              pattern="[0-9]*"
                              maxLength={10}
                              placeholder="금액"
                              value={customMemberAmounts[user.id] ?? ''}
                              onChange={e => {
                                const input = e.target.value;

                                if (!isUnsignedIntegerInput(input)) {
                                  setMemberAmountErrors(previous => ({
                                    ...previous,
                                    [user.id]: '숫자만 입력해 주세요.',
                                  }));
                                  return;
                                }

                                if (
                                  input &&
                                  Number(input) > MAX_EXPENSE_AMOUNT
                                ) {
                                  setMemberAmountErrors(previous => ({
                                    ...previous,
                                    [user.id]: `${MAX_EXPENSE_AMOUNT.toLocaleString()} 이하로 입력해 주세요.`,
                                  }));
                                  return;
                                }

                                setCustomMemberAmounts(previous => {
                                  const next = { ...previous };

                                  if (input === '') {
                                    delete next[user.id];
                                  } else {
                                    next[user.id] = Number(input);
                                  }

                                  return next;
                                });

                                setMemberAmountErrors(previous => {
                                  const next = { ...previous };
                                  delete next[user.id];
                                  return next;
                                });

                                setFieldErrors(previous => ({
                                  ...previous,
                                  members: undefined,
                                }));
                              }}
                              className={`h-[26px] w-[80px] rounded border bg-white px-2 text-right text-caption font-normal text-gray-800 outline-none focus:border-gray-400 ${
                                memberAmountErrors[user.id]
                                  ? 'border-red-500'
                                  : 'border-gray-200'
                              }`}
                            />

                            {memberAmountErrors[user.id] && (
                              <span className="text-xs text-red-500">
                                {memberAmountErrors[user.id]}
                              </span>
                            )}
                          </div>
                        )}

                      {isCustom &&
                        (isDirectInputCompleted ||
                          !checkedMembers.includes(user.id)) && (
                          <span className="font-normal text-button text-gray-800">
                            - {formatWon(settlementAmounts[user.id] ?? 0)}
                          </span>
                        )}

                      {isRatio &&
                        checkedMembers.includes(user.id) &&
                        !isDirectInputCompleted && (
                          <div className="ml-2 flex items-center gap-2">
                            <span className="font-normal text-button text-gray-800">
                              -
                            </span>

                            <input
                              type="text"
                              inputMode="numeric"
                              pattern="[0-9]*"
                              maxLength={3}
                              placeholder="비율"
                              value={customMemberRatios[user.id] ?? ''}
                              onChange={e => {
                                const input = e.target.value;

                                if (!isUnsignedIntegerInput(input)) {
                                  setMemberRatioErrors(previous => ({
                                    ...previous,
                                    [user.id]: '숫자만 입력해 주세요.',
                                  }));
                                  return;
                                }

                                if (input && Number(input) > 100) {
                                  setMemberRatioErrors(previous => ({
                                    ...previous,
                                    [user.id]: '100 이하로 입력해 주세요.',
                                  }));
                                  return;
                                }

                                setCustomMemberRatios(previous => {
                                  const next = { ...previous };

                                  if (input === '') {
                                    delete next[user.id];
                                  } else {
                                    next[user.id] = Number(input);
                                  }

                                  return next;
                                });

                                setMemberRatioErrors(previous => {
                                  const next = { ...previous };
                                  delete next[user.id];
                                  return next;
                                });

                                setFieldErrors(previous => ({
                                  ...previous,
                                  members: undefined,
                                }));
                              }}
                              className={`h-[26px] w-[60px] rounded border bg-white px-2 text-right text-caption font-normal text-gray-800 outline-none focus:border-gray-400 ${
                                memberRatioErrors[user.id]
                                  ? 'border-red-500'
                                  : 'border-gray-200'
                              }`}
                            />

                            {memberRatioErrors[user.id] && (
                              <span className="text-xs text-red-500">
                                {memberRatioErrors[user.id]}
                              </span>
                            )}

                            <span className="font-normal text-button text-gray-800">
                              %
                            </span>
                          </div>
                        )}

                      {isRatio &&
                        (isDirectInputCompleted ||
                          !checkedMembers.includes(user.id)) && (
                          <span className="font-normal text-button text-gray-800">
                            - {customMemberRatios[user.id] || 0}% (
                            {formatWon(settlementAmounts[user.id] ?? 0)})
                          </span>
                        )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {fieldErrors.members && (
              <p className="text-xs text-red-500">{fieldErrors.members}</p>
            )}
          </div>

          <TextArea
            label="메모"
            value={memo}
            onChange={e => {
              setMemo(e.target.value);
              setFieldErrors(previous => ({
                ...previous,
                memo: undefined,
              }));
            }}
            placeholder="예: 장보기, 전기요금"
            maxLength={MEMO_MAX_LENGTH}
            error={fieldErrors.memo}
            showCount
            countInside
          />
        </div>
      </fieldset>

    
      <div className="mt-2 flex w-full flex-col-reverse gap-3 pb-8 pt-4 sm:flex-row sm:items-center sm:justify-between">
  <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row sm:flex-wrap">
    <Button
      variant="primary"
      size="md"
      onClick={handleSaveClickWithFieldValidation}
      disabled={isSettled}
      className="w-full sm:w-[130px]"
    >
      {isEditMode ? '수정하기' : '저장'}
    </Button>

    <Button
      variant="secondary"
      size="md"
      onClick={handleCancelClick}
      className="hidden sm:flex sm:w-[130px]"
    >
      취소
    </Button>

    {isEditMode && (
      <Button
        variant="secondary"
        size="md"
        onClick={handleDeleteClick}
        className="w-full border-none bg-red-700 font-bold text-white hover:bg-red-700 sm:w-[130px]"
      >
        삭제
      </Button>
    )}
  </div>

  <ShareMessengerButton
    label={isSharing ? '공유 중...' : '메신저에 공유'}
    onClick={() => {
      if (currentExpenseId) {
        onShare?.(currentExpenseId);
      }
    }}
    className="w-full sm:w-auto sm:min-w-[160px]"
    disabled={isSharing || !currentExpenseId}
  />
</div>

      <ExpenseSaveModal
        isOpen={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
        onConfirm={() => void handleConfirmSave()}
        expenseName={title.trim()}
        isSaving={isSaving}
        errorMessage={saveErrorMessage}
        mode={isEditMode ? 'update' : 'create'}
      />

      <ExpenseCancelModal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        onConfirm={handleConfirmCancel}
      />

      {isEditMode && (
        <ExpenseDeleteModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={() => void handleConfirmDelete()}
          expenseName={title.trim()}
          isDeleting={isDeleting}
          errorMessage={deleteErrorMessage}
        />
      )}

      <AlertModal
        isOpen={!!alertState}
        onClose={() => setAlertState(null)}
        icon={<ExpenseIcon className="size-6" />}
        title={alertState?.title ?? '알림'}
        description={alertState?.description ?? ''}
        tone="warning"
      />
    </>
  );
};