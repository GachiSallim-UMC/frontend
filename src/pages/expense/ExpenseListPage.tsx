import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ExpenseTable, TabButton, AddExpense, ExpenseSummaryCard } from '@/features/expense';
import type { ExpenseFilter } from '@/features/expense/components/TabButton';
import { useExpenseList, useExpenseSummary } from '@/features/expense';
import type { Expense } from '@/features/expense';
import { memberApi } from '@/features/member';
import { requireSelectedGroupId } from '@/shared/api';
import { useAuthStore } from '@/shared/store';
import type { User } from '@/shared/types';
import totalExpenseIcon from '@/assets/icons/expense/totalexpense.svg';
import receiveIcon from '@/assets/icons/expense/recive.svg';
import payIcon from '@/assets/icons/expense/pay.svg';

function enrichExpenseWithMembers(expense: Expense, memberList: User[]): Expense {
  const memberMap = new Map(memberList.map((m) => [String(m.id), m]));

  const payer = memberMap.get(String(expense.payer.id)) ?? expense.payer;

  const shares = expense.shares?.map((share) => ({
    ...share,
    user: memberMap.get(String(share.user.id)) ?? share.user,
  }));

  return { ...expense, payer, shares };
}

export const ExpenseListPage = () => {
  const [activeFilter, setActiveFilter] = useState<ExpenseFilter>('TOTAL');
  const navigate = useNavigate();

  const currentUserId = useAuthStore((state) => state.userId ?? undefined);

  const [members, setMembers] = useState<User[]>([]);
  const [membersLoading, setMembersLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;

    const fetchMembers = async () => {
      setMembersLoading(true);
      try {
        const groupId = requireSelectedGroupId();
        const rawMembers = await memberApi.getGroupMembers(groupId);
        const mapped: User[] = rawMembers.map((m) => ({
          id: m.user.id,
          name: m.user.name,
          nickname: m.user.nickname,
          email: '',
          avatarUrl: m.user.profileImage ?? '',
        }));
        if (isMounted) setMembers(mapped);
      } catch (err) {
        console.error('그룹 멤버 조회 실패:', err);
      } finally {
        if (isMounted) setMembersLoading(false);
      }
    };

    fetchMembers();

    return () => {
      isMounted = false;
    };
  }, []);

  const { expenses, isLoading, error, removeExpense } = useExpenseList(activeFilter);

  const enrichedExpenses = useMemo(
    () => expenses.map((expense) => enrichExpenseWithMembers(expense, members)),
    [expenses, members]
  );

  const { totalExpense, receiveAmount, receiveCount, payAmount, payCount, uniquePayerCount } =
    useExpenseSummary(enrichedExpenses, currentUserId);

  return (
    <div className='flex justify-center w-full  min-h-0 bg-gray-50'>
      <div className='flex flex-col mt-4 lg:mt-[28px] w-full max-w-[1114px] h-full pt-4 lg:pt-[28px] pb-[60px] lg:pb-[80px] px-3 sm:px-4 lg:px-0'>
        <div className='flex flex-wrap gap-3 sm:gap-4 lg:flex-row lg:gap-[17px]'>
          <ExpenseSummaryCard
            label='이번 달 총 지출'
            amount={totalExpense}
            subText={`${uniquePayerCount}명 기준`}
            icon={<img src={totalExpenseIcon} alt='총 지출' className='w-[32px] h-[32px]' />}
          />
          <ExpenseSummaryCard
            label='내가 받아야 할 금액'
            amount={receiveAmount}
            subText={`${receiveCount}건 미정산`}
            icon={<img src={receiveIcon} alt='받을 금액' className='w-[32px] h-[32px]' />}
          />
          <ExpenseSummaryCard
            label='내가 내야 할 금액'
            amount={payAmount}
            subText={`${payCount}건 미정산`}
            icon={<img src={payIcon} alt='낼 금액' className='w-[32px] h-[32px]' />}
          />
        </div>

        <div className='w-full lg:w-[1114px] h-auto mt-4 lg:mt-[30px] mb-6 lg:mb-10 rounded-[16px] lg:rounded-[20px] bg-white flex flex-col pb-6 lg:pb-8'>
          <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 w-full px-3 sm:px-4 lg:px-[30px] pt-4 lg:pt-[30px]'>
            <div className='flex flex-wrap items-center gap-2 sm:gap-[12px] lg:gap-[16px]'>
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

            <AddExpense onClick={() => navigate('/expenses/new')} />
          </div>

          <div className='mt-4 lg:mt-[20px] px-3 sm:px-4 lg:px-[30px] pb-4 flex flex-col items-start w-full overflow-x-auto'>
            {isLoading || membersLoading ? (
              <div className='w-full py-12 lg:py-20 text-center text-gray-400'>지출 목록을 불러오는 중...</div>
            ) : error ? (
              <div className='w-full py-12 lg:py-20 text-center text-red-500'>{error}</div>
            ) : (
              <ExpenseTable
                expenses={enrichedExpenses}
                onDeleteSuccess={removeExpense}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseListPage;