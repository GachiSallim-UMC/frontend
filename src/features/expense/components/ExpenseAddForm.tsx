import React from 'react';
import arrowIcon from '@/assets/icons/expense/arrow.svg';
import calendarIcon from '@/assets/icons/expense/calendar.svg';
import { mockExpenses } from '@/features/expense/mocks/expense.mock';
import { CustomButton, IconTextButton } from '@/features/expense'; 
import MessengerIcon from '@/assets/icons/sidebar/messenger.svg?react'; 

const inputClass =
  'w-full h-[50px] px-4 pr-12 rounded-[8px] border border-gray-100 outline-none text-button placeholder:text-gray-400 bg-white';
const selectClass =
  'w-full h-[50px] px-4 pr-12 rounded-[8px] border border-gray-100 outline-none text-button bg-white appearance-none cursor-pointer';
const labelClass = 'font-sans text-caption font-bold text-gray-800';
const cardClass = 'w-full bg-white p-[16px] rounded-[18px] flex flex-col gap-5';

const RequiredMark = () => <span className='font-sans font-bold text-caption text-red-700'>*</span>;

const MOCK_USERS = Array.from(
  new Map(mockExpenses.map((expense) => [expense.payer.id, expense.payer])).values()
);

const MEMO_MAX_LENGTH = 200;

export type SettlementMethod = '균등 분할 (n/n)' | '비율 지정' | '직접입력';

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

function useSettlementAmounts({
  amount,
  memberIds,
  settlementMethod,
  memberAmounts,
}: UseSettlementAmountsParams): Record<string, number> {
  return React.useMemo(() => {
    if (memberAmounts) return memberAmounts;

    const numericAmount = Number(amount.replace(/,/g, '')) || 0;

    switch (settlementMethod) {
      case '균등 분할 (n/n)':
        return calculateEqualSplit(numericAmount, memberIds);
      default:
        return calculateEqualSplit(numericAmount, memberIds);
    }
  }, [amount, memberIds, settlementMethod, memberAmounts]);
}

function formatWon(value: number): string {
  return `${value.toLocaleString()}원`;
}

interface ExpenseAddFormProps {
  selectedPayerId?: string;
  onPayerChange?: (id: string) => void;
  memberAmounts?: Record<string, number>;
}

export const ExpenseAddForm = ({
  selectedPayerId = '',
  onPayerChange,
  memberAmounts,
}: ExpenseAddFormProps) => {
  const [title, setTitle] = React.useState('');
  const [amount, setAmount] = React.useState('0');
  const [checkedMembers, setCheckedMembers] = React.useState<string[]>([]);
  const [settlementMethod, setSettlementMethod] = React.useState<SettlementMethod>(
    '균등 분할 (n/n)'
  );
  const [memo, setMemo] = React.useState('');
  const [expenseDate, setExpenseDate] = React.useState('');
  const [payerId, setPayerId] = React.useState(selectedPayerId);

  const dateInputRef = React.useRef<HTMLInputElement>(null);

  const settlementAmounts = useSettlementAmounts({
    amount,
    memberIds: checkedMembers,
    settlementMethod,
    memberAmounts,
  });

  const toggleMember = (id: string) => {
    setCheckedMembers((prev) =>
      prev.includes(id) ? prev.filter((memberId) => memberId !== id) : [...prev, id]
    );
  };

  const handleIconClick = () => {
    dateInputRef.current?.showPicker?.();
  };

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
                className={`${inputClass} placeholder:text-gray-800`}
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
            <select id='expense-category' className={`${selectClass} text-gray-800`}>
              <option value='food'>식비</option>
              <option value='utility'>공과금/통신비</option>
              <option value='supplies'>생활용품</option>
              <option value='etc'>기타</option>
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
              onChange={(e) => setSettlementMethod(e.target.value as SettlementMethod)}
            >
              <option value='균등 분할 (n/n)'>균등 분할 (n/n)</option>
              <option value='비율 지정'>비율 지정</option>
              <option value='직접입력'>직접 입력</option>
            </select>
            <img
              src={arrowIcon}
              alt='화살표'
              className='absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none'
            />
          </div>

          {settlementMethod === '직접입력' && (
            <input
              type='text'
              placeholder='직접 입력'
              className='w-full h-[50px] px-4 rounded-[8px] border border-gray-100 outline-none text-caption placeholder:text-gray-400 bg-white text-gray-800'
            />
          )}
        </div>

        <div className='flex flex-col gap-2'>
          <label className={labelClass}>
            정산 대상 멤버 <RequiredMark />
          </label>
          <div className='flex flex-col gap-3'>
            {MOCK_USERS.map((user) => (
              <label
                key={user.id}
                htmlFor={`member-${user.id}`}
                className='flex items-center justify-between text-caption text-gray-800 cursor-pointer'
              >
                <span className='flex items-center gap-2'>
                  <input
                    id={`member-${user.id}`}
                    type='checkbox'
                    checked={checkedMembers.includes(user.id)}
                    onChange={() => toggleMember(user.id)}
                    className='w-4 h-4 rounded border-gray-100 accent-gray-800'
                  />
                  {user.name} - {formatWon(settlementAmounts[user.id] ?? 0)}
                </span>
              </label>
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
            onClick={() => {}} 
            className="w-[150px]"
          />
          <CustomButton 
            label="취소" 
            variant="secondary" 
            onClick={() => {}} 
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