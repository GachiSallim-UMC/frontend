import React from 'react';
import arrowIcon from '@/assets/icons/expense/arrow.svg';
import calendarIcon from '@/assets/icons/expense/calendar.svg';
import { mockExpenses } from '@/features/expense/mocks/expense.mock';
import { CustomButton, IconTextButton } from '@/features/expense'; 
import MessengerIcon from '@/assets/icons/sidebar/messenger.svg?react'; 
import { useSettlementAmounts } from '@/features/expense/hooks/useSettlementAmounts';
import { useExpenseForm } from '@/features/expense/hooks/useExpenseForm';
import type { SettlementMethod } from '@/features/expense/hooks/useSettlementAmounts';
import type { Expense, ExpenseCategory } from '@/features/expense/types/expense.types';

const inputClass = 'w-full h-[50px] px-4 pr-12 rounded-[8px] border border-gray-100 outline-none text-button placeholder:text-gray-400 bg-white focus:bg-white focus:border-gray-300';
const selectClass = 'w-full h-[50px] px-4 pr-12 rounded-[8px] border border-gray-100 outline-none text-button bg-white appearance-none cursor-pointer';
const labelClass = 'font-sans text-caption font-bold text-gray-800';
const cardClass = 'w-full bg-white p-[16px] rounded-[18px] flex flex-col gap-5';

const RequiredMark = () => <span className='font-sans font-bold text-caption text-red-700'>*</span>;

const MOCK_USERS = Array.from(
  new Map(mockExpenses.map((expense) => [expense.payer.id, expense.payer])).values()
);

const MEMO_MAX_LENGTH = 200;

function formatWon(value: number): string {
  return `${value.toLocaleString()}원`;
}

interface ExpenseAddFormProps {
  selectedPayerId?: string;
  onPayerChange?: (id: string) => void;
  memberAmounts?: Record<string, number>;
  initialExpense?: Expense;
  onSave?: (newExpense: Expense) => void;
  onCancel?: () => void;
}

export const ExpenseAddForm = ({
  selectedPayerId = '',
  onPayerChange,
  memberAmounts,
  initialExpense,
  onSave,
  onCancel,
}: ExpenseAddFormProps) => {
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
    mockUsers: MOCK_USERS,
    onSave,
  });

  const settlementAmounts = useSettlementAmounts({
    amount,
    memberIds: checkedMembers,
    settlementMethod,
    memberAmounts: memberAmounts || customMemberAmounts,
  });

  const handlePayerChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setPayerId(value);
    onPayerChange?.(value);
  };

  return (
    <div className='flex flex-col gap-6 w-full'>
      <div className={cardClass}>
        <h2 className='font-sans text-body font-bold text-gray-800'>기본 정보</h2>

        <div className='flex flex-col gap-2'>
          <label htmlFor='expense-title' className={labelClass}>
            항목명 <RequiredMark />
          </label>
          <input
            id='expense-title'
            type='text'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder='예: 마트 장보기, 전기요금'
            className={`${inputClass} text-gray-800`}
          />
        </div>

        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
          <div className='flex flex-col gap-2'>
            <label htmlFor='expense-amount' className={labelClass}>
              금액 <RequiredMark />
            </label>
            <input
              id='expense-amount'
              type='text'
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder='0'
              className={`${inputClass} text-gray-800`}
            />
          </div>

          <div className='flex flex-col gap-2'>
            <label htmlFor='expense-date' className={labelClass}>
              지출일 <RequiredMark />
            </label>
            <div className='relative'>
              <input
                id='expense-date'
                type='text'
                value={expenseDate}
                onChange={(e) => setExpenseDate(e.target.value)}
                placeholder='yyyy/mm/dd'
                className={`${inputClass} placeholder:text-gray-400 text-gray-800`}
              />

              <div
                onClick={handleIconClick}
                className='absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 cursor-pointer flex items-center justify-center'
              >
                <input
                  ref={dateInputRef}
                  value={expenseDate}
                  type='date'
                  onChange={(e) => setExpenseDate(e.target.value)}
                  className='absolute inset-0 opacity-0 cursor-pointer w-full h-full'
                />
                <img src={calendarIcon} alt='달력' />
              </div>
            </div>
          </div>
        </div>

        <div className='flex flex-col gap-2'>
          <label htmlFor='expense-payer' className={labelClass}>
            선지불자 <RequiredMark />
          </label>
          <div className='relative'>
            <select
              id='expense-payer'
              className={`${selectClass} ${!payerId ? 'text-gray-400' : 'text-gray-800'}`}
              value={payerId}
              onChange={handlePayerChange}
            >
              <option value='' disabled>
                선지불자 선택
              </option>
              {MOCK_USERS.map((payer) => (
                <option key={payer.id} value={payer.id} className='text-gray-800'>
                  {payer.name}
                </option>
              ))}
            </select>
            <img
              src={arrowIcon}
              alt='화살표'
              className='absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none'
            />
          </div>
        </div>

        <div className='flex flex-col gap-2'>
          <label htmlFor='expense-category' className={labelClass}>
            카테고리 <RequiredMark />
          </label>
          <div className='relative'>
            <select 
              id='expense-category' 
              className={`${selectClass} text-gray-800`}
              value={category}
              onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
            >
              <option value='tax'>세금/기타 금융</option>
              <option value='food'>식비</option>
              <option value='shopping'>쇼핑</option>
              <option value='education'>교육</option>
              <option value='mart'>편의점/마트/잡화</option>
              <option value='transport'>교통/자동차</option>
              <option value='hobby'>취미/여가</option>
              <option value='cafe'>카페/간식</option>
              <option value='living'>생활</option>
              <option value='others'>기타</option>
            </select>
            <img
              src={arrowIcon}
              alt='화살표'
              className='absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none'
            />
          </div>
        </div>
      </div>

      <div className={cardClass}>
        <h2 className='font-sans text-body font-bold text-gray-800'>정산 방식</h2>

        <div className='flex flex-col gap-2'>
          <label htmlFor='settlement-method' className={labelClass}>
            분담 방식 <RequiredMark />
          </label>
          <div className='relative'>
            <select
              id='settlement-method'
              className={`${selectClass} text-gray-800`}
              value={settlementMethod}
              onChange={(e) => handleMethodChange(e.target.value as SettlementMethod)}
            >
              <option value='균등 분할 (n/n)'>균등 분할 (n/n)</option>
              <option value='직접입력'>직접 입력</option>
            </select>
            <img
              src={arrowIcon}
              alt='화살표'
              className='absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none'
            />
          </div>
        </div>

        <div className='flex flex-col gap-2'>
          <div className='flex items-center justify-between'>
            <label className={labelClass}>
              정산 대상 멤버 <RequiredMark />
            </label>
            {settlementMethod === '직접입력' && !isDirectInputCompleted && (
              <div className='flex items-center gap-3'>
                <span className='text-caption text-gray-600'>
                  합계: <strong className='text-gray-800'>{formatWon(totalCustomSum)}</strong> / 총액: {formatWon(numericTotalAmount)}
                </span>
                <button
                  type='button'
                  onClick={handleCompleteDirectInput}
                  className='px-3 py-1 bg-gray-800 text-white rounded text-caption font-bold hover:bg-gray-700'
                >
                  완료
                </button>
              </div>
            )}
            {settlementMethod === '직접입력' && isDirectInputCompleted && (
              <button
                type='button'
                onClick={() => setIsDirectInputCompleted(false)}
                className='px-3 py-1 border border-gray-300 text-gray-700 rounded text-caption hover:bg-gray-50'
              >
                수정하기
              </button>
            )}
          </div>

          {warningMessage && (
            <div className='w-full px-4 py-2 text-orange-700 text-caption font-bold flex items-center justify-between'>
              <span>{warningMessage}</span>
              <button onClick={() => setWarningMessage(null)} className='text-orange-700 font-bold'>✕</button>
            </div>
          )}

          <div className='flex flex-col gap-1.5'>
            {MOCK_USERS.map((user) => (
              <div key={user.id} className='flex items-center justify-between text-button text-gray-800 h-[28px]'>
                <div className='flex items-center gap-2 w-full'>
                  <label
                    htmlFor={`member-${user.id}`}
                    className='flex items-center gap-2 cursor-pointer font-normal text-button text-gray-800'
                  >
                    <input
                      id={`member-${user.id}`}
                      type='checkbox'
                      checked={checkedMembers.includes(user.id)}
                      onChange={() => toggleMember(user.id)}
                      className='w-4 h-4 rounded border-gray-100 accent-gray-800'
                    />
                    <span>{user.name}</span>
                  </label>

                  {settlementMethod === '균등 분할 (n/n)' && (
                    <span className='text-gray-800 font-normal text-button'>- {formatWon(settlementAmounts[user.id] ?? 0)}</span>
                  )}

                  {settlementMethod === '직접입력' && checkedMembers.includes(user.id) && !isDirectInputCompleted && (
                    <div className='flex items-center gap-2 ml-2'>
                      <span className='text-gray-800 font-normal text-button'>-</span>
                      <input
                        type='number'
                        placeholder='금액'
                        value={customMemberAmounts[user.id] || ''}
                        onChange={(e) => {
                          const val = Number(e.target.value) || 0;
                          setCustomMemberAmounts((prev) => ({ ...prev, [user.id]: val }));
                        }}
                        className='w-[80px] h-[26px] px-2 rounded border border-gray-200 text-right text-caption text-gray-800 font-normal bg-white outline-none focus:border-gray-400 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none'
                      />
                    </div>
                  )}

                  {settlementMethod === '직접입력' && (isDirectInputCompleted || !checkedMembers.includes(user.id)) && (
                    <span className='text-gray-800 font-normal text-button'>- {formatWon(settlementAmounts[user.id] ?? 0)}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className='flex flex-col gap-2'>
          <label htmlFor='settlement-memo' className={labelClass}>
            메모
          </label>
          <div className='relative'>
            <textarea
              id='settlement-memo'
              placeholder='예: 장보기, 전기요금'
              maxLength={MEMO_MAX_LENGTH}
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              rows={3}
              className='w-full px-4 py-3 rounded-[8px] border border-gray-100 outline-none text-caption placeholder:text-gray-400 resize-none bg-white text-gray-800'
            />
            <span className='absolute bottom-2 right-3 text-caption text-gray-400'>
              {memo.length}/{MEMO_MAX_LENGTH}
            </span>
          </div>
        </div>
      </div> 

      <div className='flex flex-row items-center justify-between w-full pt-4 pb-8 mt-2'>
        <div className='flex items-center gap-3'>
          <CustomButton 
            label="저장" 
            variant="primary" 
            onClick={handleSaveClick} 
            className="w-[150px]"
          />
          <CustomButton 
            label="취소" 
            variant="secondary" 
            onClick={onCancel} 
            className="w-[150px]"
          />
        </div>

        <IconTextButton 
          label="메신저에 공유"
          variant="message"
          iconComponent={MessengerIcon}
          onClick={() => {}} 
          className="w-[189px]"
        />
      </div>
    </div>
  );
};

export default ExpenseAddForm;