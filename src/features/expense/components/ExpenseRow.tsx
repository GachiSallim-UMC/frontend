import type { Expense } from '@/features/expense/types/expense.types';
import editIcon from '@/assets/icons/expense/edit.svg';
import shareIcon from '@/assets/icons/expense/share.svg';

interface ExpenseRowProps {
  expense: Expense;
}

const GRID_COLS = 'grid-cols-[114fr_166fr_150fr_157fr_163fr_176fr_78fr]';

const ExpenseRow = ({ expense }: ExpenseRowProps) => {
  const statusStyle = expense.status === 'paid'
    ? 'bg-green-100 text-green-700'
    : 'bg-orange-100 text-orange-700';

  return (
    <div className={`grid ${GRID_COLS} items-center w-full min-w-[720px] h-[72px] pl-[20px] pr-[16px] lg:pl-[30px] lg:pr-[25px] bg-gray-0 border-b border-gray-100 last:border-b-0`}>
      <span className='font-sans font-normal text-button text-gray-900 whitespace-nowrap'>
        {expense.date}
      </span>

      <span className='font-sans font-normal text-button text-gray-900 whitespace-nowrap'>
        {expense.title}
      </span>

      <div className='flex items-center gap-[12px]'>
        <img
          src={expense.payer.avatarUrl || ''}
          alt={expense.payer.name}
          className='w-[34px] h-[34px] rounded-full object-cover bg-gray-500'
        />
        <span className='font-sans font-normal text-button text-gray-900 whitespace-nowrap'>
          {expense.payer.name}
        </span>
      </div>

      <span className='font-sans font-normal text-button text-gray-900 whitespace-nowrap'>
        {expense.amount.toLocaleString()}원
      </span>

      <span className='font-sans font-normal text-button text-gray-900 whitespace-nowrap'>
        {expense.splitType === 'equal' ? 'n/n 균등' : '비율 지정'}
      </span>

      <div className={`w-[68px] h-[34px] rounded-[100px] flex items-center justify-center whitespace-nowrap ${statusStyle}`}>
        {expense.status === 'paid' ? '완료' : '미정산'}
      </div>

      <div className='flex items-center'>
        <button className='w-[39px] h-[39px] flex items-center justify-center'>
          <img src={editIcon} alt='수정' className='w-[20px] h-[20px]' />
        </button>
        <button className='w-[39px] h-[39px] flex items-center justify-center'>
          <img src={shareIcon} alt='공유' className='w-[20px] h-[20px]' />
        </button>
      </div>
    </div>
  );
};

export default ExpenseRow;