import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ExpenseFilterControl, ExpenseTable } from '@/features/expense';
import type { ExpenseFilter as ExpenseFilterValue } from '@/features/expense';
import { useExpenseList, useExpenseSummary } from '@/features/expense';
import type { Expense } from '@/features/expense';
import { useGroupMembers } from '@/features/member';
import {
  ShareItemPickerModal,
  useShareToMessenger,
} from '@/features/messenger';
import { useAuthStore, useGroupStore } from '@/shared/store';
import { Button, SummaryCard } from '@/shared/components/ui';
import totalExpenseIcon from '@/assets/icons/expense/totalexpense.svg';
import receiveIcon from '@/assets/icons/expense/recive.svg';
import payIcon from '@/assets/icons/expense/pay.svg';
import { enrichExpenseWithMembers, mapGroupMembersToUsers } from './expenseMembers';

export const ExpenseListPage = () => {
  const [activeFilter, setActiveFilter] =
    useState<ExpenseFilterValue>('TOTAL');

  const navigate = useNavigate();

  const {
    activeType,
    chatRoomOptions,
    openShare,
    closeShare,
    handleSelectChatRoom,
    isSharePending,
  } = useShareToMessenger('expense');

  const currentUserId = useAuthStore(
    state => state.userId ?? undefined,
  );
  const selectedGroupId = useGroupStore(state => state.selectedGroupId);
  const membersQuery = useGroupMembers(selectedGroupId);
  const members = useMemo(() => mapGroupMembersToUsers(membersQuery.data), [membersQuery.data]);
  const membersLoading = membersQuery.isLoading;

  const {
    expenses,
    isLoading,
    error,
    refetch,
  } = useExpenseList(activeFilter);

  const enrichedExpenses = useMemo(
    () =>
      expenses.map(expense =>
        enrichExpenseWithMembers(expense, members),
      ),
    [expenses, members],
  );

  const {
    totalExpense,
    receiveAmount,
    receiveCount,
    payAmount,
    payCount,
    uniquePayerCount,
  } = useExpenseSummary(
    enrichedExpenses,
    currentUserId,
  );

  const handleEditExpense = (expense: Expense) => {
    navigate(`/expenses/${expense.id}`);
  };

  const handleShareExpense = (expense: Expense) => {
    openShare(String(expense.id));
  };

  return (
    <div className="w-full">
      <div className="w-full">
        <div className="hidden lg:grid lg:grid-cols-3 lg:gap-5">
          <SummaryCard
            icon={
              <img
                src={totalExpenseIcon}
                alt="총 지출"
                className="h-8 w-8"
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
                className="h-8 w-8"
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
                className="h-8 w-8"
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

        <div className="grid grid-cols-2 gap-2 lg:hidden">
          <SummaryCard
            icon={
              <img
                src={totalExpenseIcon}
                alt="총 지출"
                className="h-8 w-8"
              />
            }
            iconBg="bg-orange-100"
            iconClassName="size-[52px]"
            label="이번 달 총 지출"
            value={`${totalExpense.toLocaleString()}원`}
            subText={`${uniquePayerCount}명 기준`}
            className="row-span-2 h-full min-h-[180px] px-4 py-4 shadow-none"
            labelClassName="text-[12px] leading-[18px] tracking-normal text-gray-600"
            valueClassName="text-[20px] leading-[28px]"
            subTextClassName="mt-0.5 text-[11px] leading-[16px]"
          />

          <SummaryCard
            icon={
              <img
                src={receiveIcon}
                alt="받을 금액"
                className="h-7 w-7"
              />
            }
            iconBg="bg-orange-100"
            iconClassName="size-[48px]"
            label="내가 받아야 할 금액"
            value={`${receiveAmount.toLocaleString()}원`}
            subText={`${receiveCount}건 미정산`}
            className="min-h-[86px] px-3 py-3 shadow-none"
            labelClassName="text-[11px] leading-[16px] tracking-normal text-gray-600"
            valueClassName="text-[16px] leading-[22px]"
            subTextClassName="mt-0.5 text-[10px] leading-[14px]"
          />

          <SummaryCard
            icon={
              <img
                src={payIcon}
                alt="낼 금액"
                className="h-7 w-7"
              />
            }
            iconBg="bg-orange-100"
            iconClassName="size-[48px]"
            label="내가 내야 할 금액"
            value={`${payAmount.toLocaleString()}원`}
            subText={`${payCount}건 미정산`}
            className="min-h-[86px] px-3 py-3 shadow-none"
            labelClassName="text-[11px] leading-[16px] tracking-normal text-gray-600"
            valueClassName="text-[16px] leading-[22px]"
            subTextClassName="mt-0.5 text-[10px] leading-[14px]"
          />
        </div>

        <div className="mt-4 mb-6 flex h-auto w-full flex-col rounded-[16px] bg-white pb-6 lg:mt-[30px] lg:mb-10 lg:rounded-[20px] lg:pb-8">
          <div className="w-full px-3 pt-4 sm:px-4 lg:px-[30px] lg:pt-[30px]">
            <ExpenseFilterControl
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
            />
          </div>

          <div className="mt-4 flex w-full flex-col items-start overflow-x-auto px-3 pb-4 sm:px-4 lg:mt-[20px] lg:px-[30px]">
            {isLoading || membersLoading ? (
              <div className="w-full py-12 text-center text-gray-400 lg:py-20">
                지출 목록을 불러오는 중...
              </div>
            ) : error || membersQuery.isError ? (
              <div className="flex w-full flex-col items-center gap-3 py-12 text-center text-red-500 lg:py-20">
                <p>{membersQuery.isError ? '그룹원 정보를 불러오지 못했습니다.' : error}</p>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    void refetch();
                    void membersQuery.refetch();
                  }}
                >
                  다시 시도
                </Button>
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
