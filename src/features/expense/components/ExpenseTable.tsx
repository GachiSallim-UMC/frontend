import ExpenseRow from './ExpenseRow';
import type { Expense } from '@/features/expense/types/expense.types';

interface ExpenseTableProps {
  expenses: Expense[];
}

const GRID_COLS = 'grid-cols-[114fr_166fr_150fr_157fr_163fr_176fr_78fr]';

const ExpenseTable = ({ expenses }: ExpenseTableProps) => {
  return (
    <div className='w-full min-w-[720px] rounded-t-[10px] bg-white border-[1px] border-gray-100 flex flex-col overflow-hidden'>
      <div className={`grid ${GRID_COLS} items-center w-full h-[60px] pl-[20px] pr-[16px] lg:pl-[30px] lg:pr-[25px] bg-primary-50 border-b border-gray-100`}>
        <span className='font-sans font-bold text-caption text-gray-500 whitespace-nowrap'>날짜</span>
        <span className='font-sans font-bold text-caption text-gray-500 whitespace-nowrap'>항목</span>
        <span className='font-sans font-bold text-caption text-gray-500 whitespace-nowrap'>지불자</span>
        <span className='font-sans font-bold text-caption text-gray-500 whitespace-nowrap'>총액</span>
        <span className='font-sans font-bold text-caption text-gray-500 whitespace-nowrap'>분담 방식</span>
        <span className='font-sans font-bold text-caption text-gray-500 whitespace-nowrap'>상태</span>
        <span />
      </div>

      <div className='flex flex-col'>
        {expenses.map((expense) => (
          <ExpenseRow key={expense.id} expense={expense} />
        ))}
      </div>
    </div>
  );
};

export default ExpenseTable;