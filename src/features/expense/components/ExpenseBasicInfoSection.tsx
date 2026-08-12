import type { ChangeEvent, RefObject } from 'react';
import calendarIcon from '@/assets/icons/expense/calendar.svg';
import { FormInput, SelectDropdown } from '@/shared/components/form';
import type { User } from '@/shared/types';
import type { ExpenseCategory } from '@/features/expense/types';
import { CATEGORY_OPTIONS, TODAY_DATE_ONLY } from '@/features/expense/lib/expenseForm.constants';
import type { ExpenseFieldErrors } from '@/features/expense/lib/expenseFormValidation';
import { EXPENSE_FORM_CARD_CLASS, EXPENSE_FORM_LABEL_CLASS } from '@/features/expense/components/expenseForm.styles';

interface ExpenseBasicInfoSectionProps {
  title: string;
  amount: string;
  expenseDate: string;
  payerId: string;
  category: ExpenseCategory;
  members: User[];
  membersLoading?: boolean;
  isEditMode: boolean;
  errors: ExpenseFieldErrors;
  dateInputRef: RefObject<HTMLInputElement>;
  onTitleChange: (value: string) => void;
  onAmountChange: (value: string) => void;
  onDateChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onDateBlur: () => void;
  onCalendarClick: () => void;
  onPayerChange: (value: string) => void;
  onCategoryChange: (value: ExpenseCategory) => void;
}

export const ExpenseBasicInfoSection = ({
  title,
  amount,
  expenseDate,
  payerId,
  category,
  members,
  membersLoading,
  isEditMode,
  errors,
  dateInputRef,
  onTitleChange,
  onAmountChange,
  onDateChange,
  onDateBlur,
  onCalendarClick,
  onPayerChange,
  onCategoryChange,
}: ExpenseBasicInfoSectionProps) => (
  <div className={EXPENSE_FORM_CARD_CLASS}>
    <h2 className="hidden font-sans text-body font-bold text-gray-800 sm:block">기본 정보</h2>

    <FormInput
      label="항목명"
      required
      inputSize="sm"
      value={title}
      onChange={event => onTitleChange(event.target.value)}
      maxLength={100}
      placeholder="예: 마트 장보기, 전기요금"
      error={errors.title}
    />

    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <FormInput
        label="금액"
        required
        inputSize="sm"
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        maxLength={10}
        value={amount}
        onChange={event => onAmountChange(event.target.value)}
        placeholder="0"
        error={errors.amount}
      />

      <div className="flex flex-col gap-2">
        <label htmlFor="expense-date" className={EXPENSE_FORM_LABEL_CLASS}>
          지출일 *
        </label>
        <div className="relative">
          <input
            id="expense-date"
            ref={dateInputRef}
            type="date"
            value={expenseDate}
            onChange={onDateChange}
            onBlur={onDateBlur}
            max={TODAY_DATE_ONLY}
            disabled={isEditMode}
            placeholder="yyyy-mm-dd"
            className={`h-[50px] w-full rounded-[8px] border bg-white px-4 pr-12 text-button text-gray-800 outline-none placeholder:text-gray-400 focus:bg-white focus:ring-2 focus:ring-primary-500 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-400 [&::-webkit-calendar-picker-indicator]:hidden ${
              errors.date ? 'border-red-500' : 'border-gray-100'
            }`}
          />
          <button
            type="button"
            onClick={onCalendarClick}
            disabled={isEditMode}
            aria-label="달력 열기"
            className="absolute right-4 top-1/2 flex h-6 w-6 -translate-y-1/2 cursor-pointer items-center justify-center disabled:cursor-not-allowed disabled:opacity-40"
          >
            <img src={calendarIcon} alt="" />
          </button>
        </div>
        {errors.date && <p className="mt-1.5 text-xs text-red-500">{errors.date}</p>}
      </div>
    </div>

    <SelectDropdown
      label="선지불자"
      required
      inputSize="sm"
      value={payerId}
      onChange={onPayerChange}
      options={members.map(payer => ({ value: String(payer.id), label: payer.name }))}
      placeholder={membersLoading ? '멤버 불러오는 중...' : '선지불자 선택'}
      error={errors.payerId}
      disabled={membersLoading || isEditMode}
    />

    <SelectDropdown
      label="카테고리"
      required
      inputSize="sm"
      value={category}
      onChange={value => onCategoryChange(value as ExpenseCategory)}
      options={CATEGORY_OPTIONS}
      placeholder=""
      error={errors.category}
    />
  </div>
);
