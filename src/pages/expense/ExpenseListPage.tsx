import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ExpenseTable } from '@/features/expense';
import { ExpenseFilter } from '@/features/expense/components/ExpenseFilter';
import type { ExpenseFilter as ExpenseFilterValue } from '@/features/expense';
import { useExpenseList, useExpenseSummary } from '@/features/expense';
import type { Expense } from '@/features/expense';
import { memberApi } from '@/features/member';
import { ShareItemPickerModal, useShareToMessenger } from '@/features/messenger';
import { requireSelectedGroupId } from '@/shared/api';
import { useAuthStore } from '@/shared/store';
import type { User } from '@/shared/types';
import { SummaryCard } from '@/shared/components/ui';
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
  const [activeFilter, setActiveFilter] = useState<ExpenseFilterValue>('TOTAL');
  const navigate = useNavigate();
  const { activeType, chatRoomOptions, openShare, closeShare, handleSelectChatRoom, isSharePending } =
    useShareToMessenger('expense');

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
          name: m.user.nickname || m.user.name,
          nickname: m.user.nickname,
          email: '',
          avatarUrl: m.user.profileImage ?? undefined,
        }));

        if (isMounted) {
          setMembers(mapped);
        }
      } catch (err) {
        console.error('그룹 멤버 조회 실패:', err);
      } finally {
        if (isMounted) {
          setMembersLoading(false);
        }
      }
    };

    fetchMembers();

    return () => {
      isMounted = false;
    };
  }, []);

  const { expenses, isLoading, error } = useExpenseList(activeFilter);

  const enrichedExpenses = useMemo(
    () =>
      expenses.map((expense) =>
        enrichExpenseWithMembers(expense, members)
      ),
    [expenses, members]
  );

  const {
    totalExpense,
    receiveAmount,
    receiveCount,
    payAmount,
    payCount,
    uniquePayerCount,
  } = useExpenseSummary(enrichedExpenses, currentUserId);

  const handleEditExpense = (expense: Expense) => {
    navigate(`/expenses/${expense.id}`);
  };

  const handleShareExpense = (expense: Expense) => {
    openShare(String(expense.id));
  };

  return (
    <div className='flex w-full min-h-0 bg-gray-50'>
      <div className='flex flex-col w-full h-full pb-[60px] lg:pb-[80px]'>
        <div className='grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 lg:gap-[17px]'>

          <SummaryCard
            icon={
              <img
                src={totalExpenseIcon}
                alt="총 지출"
                className="w-[32px] h-[32px]"
              />
            }
            iconBg="bg-orange-100"
            iconClassName="size-[77px]"
            label="이번 달 총 지출"
            value={`${totalExpense.toLocaleString()}원`}
            subText={`${uniquePayerCount}명 기준`}
            className="h-[147px] px-6 py-0 shadow-none"
            labelClassName="leading-[19px] tracking-[0.62px] text-gray-600"
            valueClassName="leading-[37px]"
            subTextClassName="mt-0.5 leading-[19px]"
          />

          <SummaryCard
            icon={
              <img
                src={receiveIcon}
                alt="받을 금액"
                className="w-[32px] h-[32px]"
              />
            }
            iconBg="bg-orange-100"
            iconClassName="size-[77px]"
            label="내가 받아야 할 금액"
            value={`${receiveAmount.toLocaleString()}원`}
            subText={`${receiveCount}건 미정산`}
            className="h-[147px] px-6 py-0 shadow-none"
            labelClassName="leading-[19px] tracking-[0.62px] text-gray-600"
            valueClassName="leading-[37px]"
            subTextClassName="mt-0.5 leading-[19px]"
          />

          <SummaryCard
            icon={
              <img
                src={payIcon}
                alt="낼 금액"
                className="w-[32px] h-[32px]"
              />
            }
            iconBg="bg-orange-100"
            iconClassName="size-[77px]"
            label="내가 내야 할 금액"
            value={`${payAmount.toLocaleString()}원`}
            subText={`${payCount}건 미정산`}
            className="h-[147px] px-6 py-0 shadow-none"
            labelClassName="leading-[19px] tracking-[0.62px] text-gray-600"
            valueClassName="leading-[37px]"
            subTextClassName="mt-0.5 leading-[19px]"
          />
        </div>

        <div className='w-full h-auto mt-4 lg:mt-[30px] mb-6 lg:mb-10 rounded-[16px] lg:rounded-[20px] bg-white flex flex-col pb-6 lg:pb-8'>
          <div className='w-full px-3 sm:px-4 lg:px-[30px] pt-4 lg:pt-[30px]'>

            <ExpenseFilter
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
            />
          </div>

          <div className="mt-4 lg:mt-[20px] px-3 sm:px-4 lg:px-[30px] pb-4 flex flex-col items-start w-full overflow-x-auto">
            {isLoading || membersLoading ? (
              <div className="w-full py-12 lg:py-20 text-center text-gray-400">
                지출 목록을 불러오는 중...
              </div>
            ) : error ? (
              <div className="w-full py-12 lg:py-20 text-center text-red-500">
                {error}
              </div>
            ) : (
              <ExpenseTable
                expenses={enrichedExpenses}
                onEdit={handleEditExpense}
                onShare={handleShareExpense}
              />
            )}
          </div>
        </div>
      </div>
      <ShareItemPickerModal
        type={activeType}
        options={chatRoomOptions}
        onSelect={handleSelectChatRoom}
        onClose={closeShare}
        isSubmitting={isSharePending}
      />
    </div>
  );
};

export default ExpenseListPage;