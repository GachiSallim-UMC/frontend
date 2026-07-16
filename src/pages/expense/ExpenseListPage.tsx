import { useState } from 'react';
import { ExpenseTable, TabButton, AddExpense, ExpenseSummaryCard } from '@/features/expense' 
import type { ExpenseFilter } from '@/features/expense/components/TabButton';
import type { Expense } from '@/features/expense/types/expense.types';
import { mockExpenses } from '@/features/expense/mocks/expense.mock';
import totalExpenseIcon from '@/assets/icons/expense/totalexpense.svg';
import receiveIcon from '@/assets/icons/expense/recive.svg';
import payIcon from '@/assets/icons/expense/pay.svg';

interface ExpenseListPageProps {
  expenses?: Expense[];
  title?: string;
}

export const ExpenseListPage = ({ expenses = mockExpenses }: ExpenseListPageProps) => {
  const [activeFilter, setActiveFilter] = useState<ExpenseFilter>('TOTAL');

  return (
    <div className='flex justify-center w-full flex-1 min-h-0 bg-gray-50'>
      <div className='flex flex-col mt-[28px] w-full max-w-[1114px] h-full pt-[28px] pb-[28px] px-4 lg:px-0'>
        <div className='flex flex-wrap gap-4 lg:flex-row lg:gap-[17px]'>
          <ExpenseSummaryCard
            label='이번 달 총 지출'
            amount={138000}
            subText='3명 기준'
            icon={<img src={totalExpenseIcon} alt='총 지출' className='w-[32px] h-[32px]' />}
          />
          <ExpenseSummaryCard
            label='내가 받아야 할 금액'
            amount={28000}
            subText='2건 미정산'
            icon={<img src={receiveIcon} alt='받을 금액' className='w-[32px] h-[32px]' />}
          />
          <ExpenseSummaryCard
            label='내가 내야 할 금액'
            amount={-14000}
            subText='1건 미정산'
            icon={<img src={payIcon} alt='낼 금액' className='w-[32px] h-[32px]' />}
          />
        </div>

        <div className='w-full lg:w-[1114px] min-h-[484px] mt-[30px] rounded-[20px] bg-white flex flex-col'>
          <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 w-full px-4 lg:px-[30px] pt-[20px] lg:pt-[30px]'>
            <div className='flex flex-wrap items-center gap-[12px] lg:gap-[16px]'>
              <TabButton
                label='전체 상태'
                filter='TOTAL'
                activeFilter={activeFilter}
                onFilterChange={setActiveFilter}
              />
              <TabButton
                label='이번 달'
                filter='THIS_MONTH'
                activeFilter={activeFilter}
                onFilterChange={setActiveFilter}
              />
            </div>

            <AddExpense onClick={() => console.log('생활비 등록 클릭')} />
          </div>

          <div className='mt-[20px] px-4 lg:px-[30px] flex flex-col items-start w-full overflow-x-auto'>
            <ExpenseTable expenses={expenses} />
          </div>
        </div>
      </div>
    </div>
  );
};

