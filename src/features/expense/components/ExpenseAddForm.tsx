import React, { useState, useEffect } from 'react';
import calendarIcon from '@/assets/icons/expense/calendar.svg';
import { useSettlementAmounts, useExpenseForm } from '@/features/expense';
import type { SettlementMethod } from '@/features/expense';
import type { Expense, ExpenseCategory } from '@/features/expense';
import type { User } from '@/shared/types';
import ExpenseIcon from '@/assets/icons/sidebar/expenses.svg?react';
import { FormInput, SelectDropdown, TextArea } from '@/shared/components/form';
import { ShareMessengerButton, Button, ConfirmModal } from '@/shared/components/';
import { useAlertStore } from '@/shared/store';
import {
  isDateOnlyInputValue,
  isUnsignedIntegerInput,
  isValidDateOnly,
} from '@/shared/lib/inputValidation';

const labelClass = 'font-sans text-caption font-bold text-gray-800';
const cardClass = 'w-full bg-white p-[16px] rounded-[18px] flex flex-col gap-5 lg:p-[32px]';
const toLocalDateOnly = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};
const todayStr = toLocalDateOnly(new Date());
const RequiredMark = () => <span className="font-sans font-bold text-caption text-red-700">*</span>;
const MEMO_MAX_LENGTH = 255;
const MAX_EXPENSE_AMOUNT = 2_147_483_647;

type ExpenseFieldErrors = Partial<
  Record<'title' | 'amount' | 'date' | 'payerId' | 'category' | 'members' | 'memo', string>
>;

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
  /** 저장된 지출을 메신저에 공유 — 방 목록 조회/전송은 상위 페이지(useShareToMessenger)가 담당 */
  onShare?: (expenseId: string) => void;
  isSharing?: boolean;
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
}: ExpenseAddFormProps) => {
  const [currentExpenseId, setCurrentExpenseId] = useState<string | undefined>(expenseId);
  const [fieldErrors, setFieldErrors] = useState<ExpenseFieldErrors>({});
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveErrorMessage, setSaveErrorMessage] = useState<string | undefined>(undefined);
  const [memberAmountErrors, setMemberAmountErrors] = useState<Record<string, string>>({});
  const [memberRatioErrors, setMemberRatioErrors] = useState<Record<string, string>>({});

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
      useAlertStore.getState().showAlert({
        title: '알림',
        message: '오늘 이전의 날짜는 선택할 수 없습니다.',
      });
      setExpenseDate(todayStr);
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
      setFieldErrors(previous => ({ ...previous, amount: '금액은 숫자만 입력해 주세요.' }));
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
    if (settlementMethod !== 'EQUAL') setIsDirectInputCompleted(false);
  };

  const handleSaveClickWithGuard = async () => {
    if (isSettled) {
      useAlertStore.getState().showAlert({
        title: '알림',
        message: '정산 완료된 내역은 수정할 수 없습니다.',
      });
      return;
    }
    // 저장 실패를 호출부에서 잡을 수 있도록 반드시 Promise를 넘긴다.
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
        if (value === undefined) nextAmountErrors[id] = '금액을 입력해 주세요.';
        else if (!Number.isSafeInteger(value) || value < 0 || value > MAX_EXPENSE_AMOUNT) {
          nextAmountErrors[id] =
            `0부터 ${MAX_EXPENSE_AMOUNT.toLocaleString()} 사이의 정수를 입력해 주세요.`;
        }
      });
    }

    if (isRatio) {
      checkedMembers.forEach(id => {
        const value = customMemberRatios[id];
        if (value === undefined) nextRatioErrors[id] = '비율을 입력해 주세요.';
        else if (!Number.isSafeInteger(value) || value < 0 || value > 100) {
          nextRatioErrors[id] = '0부터 100 사이의 정수를 입력해 주세요.';
        }
      });
    }

    setMemberAmountErrors(nextAmountErrors);
    setMemberRatioErrors(nextRatioErrors);
    return Object.keys(nextAmountErrors).length === 0 && Object.keys(nextRatioErrors).length === 0;
  };

  const validateForm = () => {
    const nextErrors: ExpenseFieldErrors = {};
    const parsedAmount = Number(amount);

    if (!title.trim()) nextErrors.title = '항목명을 입력해 주세요.';
    else if (title.trim().length > 100) nextErrors.title = '항목명은 100자 이하로 입력해 주세요.';
    if (!amount) nextErrors.amount = '금액을 입력해 주세요.';
    else if (
      !Number.isSafeInteger(parsedAmount) ||
      parsedAmount < 1 ||
      parsedAmount > MAX_EXPENSE_AMOUNT
    ) {
      nextErrors.amount = `금액은 1원부터 ${MAX_EXPENSE_AMOUNT.toLocaleString()}원 사이의 정수로 입력해 주세요.`;
    }
    if (!expenseDate) nextErrors.date = '지출일을 선택해 주세요.';
    else if (!isValidDateOnly(expenseDate)) nextErrors.date = '올바른 지출일을 선택해 주세요.';
    else if (expenseDate < todayStr) nextErrors.date = '지출일은 오늘 이후로 선택해 주세요.';
    if (!payerId) nextErrors.payerId = '선지불자를 선택해 주세요.';
    if (!category) nextErrors.category = '카테고리를 선택해 주세요.';
    if (checkedMembers.length === 0)
      nextErrors.members = '정산 대상 멤버를 한 명 이상 선택해 주세요.';
    if (memo.length > MEMO_MAX_LENGTH) {
      nextErrors.memo = `메모는 ${MEMO_MAX_LENGTH}자 이하로 입력해 주세요.`;
    }

    const areMemberInputsValid = validateMemberInputs();
    if ((isCustom || isRatio) && !areMemberInputsValid) {
      nextErrors.members = '멤버별 입력값을 확인해 주세요.';
    } else if ((isCustom || isRatio) && !isDirectInputCompleted) {
      nextErrors.members = '멤버별 금액 또는 비율을 확인한 뒤 완료를 눌러 주세요.';
    }

    setFieldErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleCompleteDirectInputWithValidation = () => {
    if (!validateMemberInputs()) {
      setFieldErrors(previous => ({ ...previous, members: '멤버별 입력값을 확인해 주세요.' }));
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
      setFieldErrors(previous => ({ ...previous, members: '멤버별 비율 합계가 100%여야 합니다.' }));
      return;
    }
    setFieldErrors(previous => ({ ...previous, members: undefined }));
    handleCompleteDirectInput();
  };

  // 검증까지만 하고 확인 모달을 연다. 실제 저장은 모달에서 확인한 뒤 수행.
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
      // 실패 시 모달을 열어둔 채 사유를 모달 안에서 보여준다.
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

  return (
    <div className="flex flex-col gap-6 w-full lg:gap-[30px]">
      {isSettled && (
        <div className="w-full bg-red-100 text-red-700 text-caption font-bold p-3 rounded-[8px] text-center">
          정산이 완료된 내역이라 수정할 수 없습니다.
        </div>
      )}

      <fieldset
        disabled={isSettled}
        className={`flex flex-col gap-6 w-full ${isSettled ? 'opacity-60' : ''}`}
      >
        <div className={cardClass}>
          <h2 className="font-sans text-body font-bold text-gray-800">기본 정보</h2>

          <FormInput
            label="항목명"
            required
            value={title}
            onChange={e => {
              setTitle(e.target.value);
              setFieldErrors(previous => ({ ...previous, title: undefined }));
            }}
            maxLength={100}
            placeholder="예: 마트 장보기, 전기요금"
            error={fieldErrors.title}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                {/* 브라우저 기본 달력 아이콘은 숨기고 커스텀 아이콘만 노출합니다. */}
                <input
                  id="expense-date"
                  ref={dateInputRef}
                  type="date"
                  value={expenseDate}
                  onChange={handleDateChange}
                  onBlur={handleDateBlur}
                  min={todayStr}
                  placeholder="yyyy-mm-dd"
                  className={`w-full h-[50px] px-4 pr-12 rounded-[8px] border outline-none text-button placeholder:text-gray-400 bg-white focus:bg-white focus:ring-2 focus:ring-primary-500 text-gray-800 [&::-webkit-calendar-picker-indicator]:hidden ${fieldErrors.date ? 'border-red-500' : 'border-gray-100'}`}
                />

                <button
                  type="button"
                  onClick={handleIconClick}
                  aria-label="달력 열기"
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 cursor-pointer flex items-center justify-center"
                >
                  <img src={calendarIcon} alt="" />
                </button>
              </div>
              {fieldErrors.date && (
                <p className="mt-1.5 text-xs text-red-500">{fieldErrors.date}</p>
              )}
            </div>
          </div>

          <SelectDropdown
            label="선지불자"
            required
            value={payerId}
            onChange={handlePayerSelect}
            options={members.map(payer => ({ value: String(payer.id), label: payer.name }))}
            placeholder={membersLoading ? '멤버 불러오는 중...' : '선지불자 선택'}
            error={fieldErrors.payerId}
            disabled={membersLoading}
          />

          <SelectDropdown
            label="카테고리"
            required
            value={category}
            onChange={v => {
              setCategory(v as ExpenseCategory);
              setFieldErrors(previous => ({ ...previous, category: undefined }));
            }}
            options={CATEGORY_OPTIONS}
            placeholder=""
            error={fieldErrors.category}
          />
        </div>

        <div className={cardClass}>
          <h2 className="font-sans text-body font-bold text-gray-800">정산 방식</h2>

          <SelectDropdown
            label="분담 방식"
            required
            value={settlementMethod}
            onChange={v => {
              handleMethodChange(v as SettlementMethod);
              setFieldErrors(previous => ({ ...previous, members: undefined }));
              setMemberAmountErrors({});
              setMemberRatioErrors({});
            }}
            options={SPLIT_METHOD_OPTIONS}
            placeholder=""
          />

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className={labelClass}>
                정산 대상 멤버 <RequiredMark />
              </label>
              {(isCustom || isRatio) && !isDirectInputCompleted && (
                <div className="flex items-center gap-3">
                  {isRatio ? (
                    <span className="text-caption text-gray-600">
                      합계: <strong className="text-gray-800">{totalRatioSum}%</strong> / 100%
                    </span>
                  ) : (
                    <span className="text-caption text-gray-600">
                      합계: <strong className="text-gray-800">{formatWon(totalCustomSum)}</strong> /
                      총액: {formatWon(numericTotalAmount)}
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={handleCompleteDirectInputWithValidation}
                    className="px-3 py-1 bg-gray-800 text-white rounded text-caption font-bold hover:bg-gray-700"
                  >
                    완료
                  </button>
                </div>
              )}
              {(isCustom || isRatio) && isDirectInputCompleted && (
                <button
                  type="button"
                  onClick={() => setIsDirectInputCompleted(false)}
                  className="px-3 py-1 border border-gray-300 text-gray-700 rounded text-caption hover:bg-gray-50"
                >
                  수정하기
                </button>
              )}
            </div>

            {warningMessage && (
              <div className="w-full px-4 py-2 text-orange-700 text-caption font-bold flex items-center justify-between">
                <span>{warningMessage}</span>
                <button
                  onClick={() => setWarningMessage(null)}
                  className="text-orange-700 font-bold"
                >
                  ✕
                </button>
              </div>
            )}

            <div
              className={`flex flex-col gap-1.5 rounded-lg ${fieldErrors.members ? 'border border-red-500 p-2' : ''}`}
            >
              {membersLoading ? (
                <div className="text-caption text-gray-400 py-2">멤버 목록을 불러오는 중...</div>
              ) : (
                members.map(user => (
                  <div
                    key={user.id}
                    className="flex min-h-[28px] items-center justify-between text-button text-gray-800"
                  >
                    <div className="flex w-full flex-wrap items-center gap-2">
                      <label
                        htmlFor={`member-${user.id}`}
                        className="flex items-center gap-2 cursor-pointer font-normal text-button text-gray-800"
                      >
                        <input
                          id={`member-${user.id}`}
                          type="checkbox"
                          checked={checkedMembers.includes(user.id)}
                          onChange={() => {
                            toggleMember(user.id);
                            setFieldErrors(previous => ({ ...previous, members: undefined }));
                          }}
                          className="w-4 h-4 rounded border-gray-100 accent-gray-800"
                        />
                        <span>{user.name}</span>
                      </label>

                      {settlementMethod === 'EQUAL' && (
                        <span className="text-gray-800 font-normal text-button">
                          - {formatWon(settlementAmounts[user.id] ?? 0)}
                        </span>
                      )}

                      {isCustom && checkedMembers.includes(user.id) && !isDirectInputCompleted && (
                        <div className="flex items-center gap-2 ml-2">
                          <span className="text-gray-800 font-normal text-button">-</span>
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
                              if (input && Number(input) > MAX_EXPENSE_AMOUNT) {
                                setMemberAmountErrors(previous => ({
                                  ...previous,
                                  [user.id]: `${MAX_EXPENSE_AMOUNT.toLocaleString()} 이하로 입력해 주세요.`,
                                }));
                                return;
                              }
                              setCustomMemberAmounts(previous => {
                                const next = { ...previous };
                                if (input === '') delete next[user.id];
                                else next[user.id] = Number(input);
                                return next;
                              });
                              setMemberAmountErrors(previous => {
                                const next = { ...previous };
                                delete next[user.id];
                                return next;
                              });
                              setFieldErrors(previous => ({ ...previous, members: undefined }));
                            }}
                            className={`w-[80px] h-[26px] px-2 rounded border text-right text-caption text-gray-800 font-normal bg-white outline-none focus:border-gray-400 ${memberAmountErrors[user.id] ? 'border-red-500' : 'border-gray-200'}`}
                          />
                          {memberAmountErrors[user.id] && (
                            <span className="text-xs text-red-500">
                              {memberAmountErrors[user.id]}
                            </span>
                          )}
                        </div>
                      )}

                      {isCustom &&
                        (isDirectInputCompleted || !checkedMembers.includes(user.id)) && (
                          <span className="text-gray-800 font-normal text-button">
                            - {formatWon(settlementAmounts[user.id] ?? 0)}
                          </span>
                        )}

                      {isRatio && checkedMembers.includes(user.id) && !isDirectInputCompleted && (
                        <div className="flex items-center gap-2 ml-2">
                          <span className="text-gray-800 font-normal text-button">-</span>
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
                                if (input === '') delete next[user.id];
                                else next[user.id] = Number(input);
                                return next;
                              });
                              setMemberRatioErrors(previous => {
                                const next = { ...previous };
                                delete next[user.id];
                                return next;
                              });
                              setFieldErrors(previous => ({ ...previous, members: undefined }));
                            }}
                            className={`w-[60px] h-[26px] px-2 rounded border text-right text-caption text-gray-800 font-normal bg-white outline-none focus:border-gray-400 ${memberRatioErrors[user.id] ? 'border-red-500' : 'border-gray-200'}`}
                          />
                          {memberRatioErrors[user.id] && (
                            <span className="text-xs text-red-500">
                              {memberRatioErrors[user.id]}
                            </span>
                          )}
                          <span className="text-gray-800 font-normal text-button">%</span>
                        </div>
                      )}

                      {isRatio && (isDirectInputCompleted || !checkedMembers.includes(user.id)) && (
                        <span className="text-gray-800 font-normal text-button">
                          - {customMemberRatios[user.id] || 0}% (
                          {formatWon(settlementAmounts[user.id] ?? 0)})
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
            {fieldErrors.members && <p className="text-xs text-red-500">{fieldErrors.members}</p>}
          </div>

          <TextArea
            label="메모"
            value={memo}
            onChange={e => {
              setMemo(e.target.value);
              setFieldErrors(previous => ({ ...previous, memo: undefined }));
            }}
            placeholder="예: 장보기, 전기요금"
            maxLength={MEMO_MAX_LENGTH}
            error={fieldErrors.memo}
            showCount
            countInside
          />
        </div>
      </fieldset>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 w-full pt-4 pb-8 mt-2">
        <div className="flex items-center gap-3">
          <Button
            variant="primary"
            size="md"
            onClick={handleSaveClickWithFieldValidation}
            disabled={isSettled}
            className="flex-1 sm:w-[150px]"
          >
            {isEditMode ? '수정하기' : '저장'}
          </Button>
          <Button variant="secondary" size="md" onClick={onCancel} className="flex-1 sm:w-[150px]">
            취소
          </Button>
        </div>

        {currentExpenseId && (
          <ShareMessengerButton
            label={isSharing ? '공유 중...' : '메신저에 공유'}
            onClick={() => onShare?.(currentExpenseId)}
            className="w-full sm:w-[189px]"
            disabled={isSharing}
          />
        )}
      </div>

      <ConfirmModal
        isOpen={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
        onConfirm={() => void handleConfirmSave()}
        icon={<ExpenseIcon className="size-6" />}
        title={isEditMode ? '생활비를 수정할까요?' : '생활비를 등록할까요?'}
        highlight={title.trim()}
        description={isEditMode ? '생활비 데이터를 수정합니다.' : '내용으로 생활비를 등록합니다.'}
        confirmLabel={isEditMode ? '수정하기' : '저장하기'}
        isPending={isSaving}
        errorMessage={saveErrorMessage}
        tone={isEditMode ? 'edit' : 'default'}
      />
    </div>
  );
};
