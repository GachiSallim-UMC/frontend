import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ExpenseFilterControl, ExpenseTable } from '@/features/expense';
import type {
  ExpenseFilter as ExpenseFilterValue,
  ExpenseStatusFilter,
} from '@/features/expense';
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

const DESKTOP_SUMMARY_CARD_CLASS =
  'h-[147px] gap-3 px-4 py-0 shadow-none min-[1200px]:gap-4 min-[1200px]:px-6';
const DESKTOP_SUMMARY_ICON_CLASS = 'size-[60px] min-[1200px]:size-[77px]';
const DESKTOP_SUMMARY_IMAGE_CLASS = 'size-7 min-[1200px]:size-8';

export const ExpenseListPage = () => {
  const [activeFilter, setActiveFilter] =
    useState<ExpenseFilterValue>('THIS_MONTH');
  const [statusFilter, setStatusFilter] = useState<ExpenseStatusFilter>('ALL');

  const navigate = useNavigate();
  const totalExpenseLabel = activeFilter === 'THIS_MONTH' ? '이번 달 총 지출' : '전체 총 지출';

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

  const visibleExpenses = useMemo(
    () =>
      statusFilter === 'ALL'
        ? enrichedExpenses
        : enrichedExpenses.filter(expense => expense.status === statusFilter),
    [enrichedExpenses, statusFilter],
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
                className={DESKTOP_SUMMARY_IMAGE_CLASS}
              />
            }
            iconBg="bg-orange-100"
            iconClassName={DESKTOP_SUMMARY_ICON_CLASS}
            label={totalExpenseLabel}
            value={`${totalExpense.toLocaleString()}원`}
            subText={`${uniquePayerCount}명 기준`}
            className={DESKTOP_SUMMARY_CARD_CLASS}
            labelClassName="leading-[19px] tracking-[0.62px] text-gray-600"
            valueClassName="leading-[37px]"
            subTextClassName="mt-0.5 leading-[19px]"
          />

          <SummaryCard
            icon={
              <img
                src={receiveIcon}
                alt="받을 금액"
                className={DESKTOP_SUMMARY_IMAGE_CLASS}
              />
            }
            iconBg="bg-orange-100"
            iconClassName={DESKTOP_SUMMARY_ICON_CLASS}
            label="내가 받아야 할 금액"
            value={`${receiveAmount.toLocaleString()}원`}
            subText={`${receiveCount}건 미정산`}
            className={DESKTOP_SUMMARY_CARD_CLASS}
            labelClassName="leading-[19px] tracking-[0.62px] text-gray-600"
            valueClassName="leading-[37px]"
            subTextClassName="mt-0.5 leading-[19px]"
          />

          <SummaryCard
            icon={
              <img
                src={payIcon}
                alt="낼 금액"
                className={DESKTOP_SUMMARY_IMAGE_CLASS}
              />
            }
            iconBg="bg-orange-100"
            iconClassName={DESKTOP_SUMMARY_ICON_CLASS}
            label="내가 내야 할 금액"
            value={`${payAmount.toLocaleString()}원`}
            subText={`${payCount}건 미정산`}
            className={DESKTOP_SUMMARY_CARD_CLASS}
            labelClassName="leading-[19px] tracking-[0.62px] text-gray-600"
            valueClassName="leading-[37px]"
            subTextClassName="mt-0.5 leading-[19px]"
          />
        </div>

        <div className="grid h-[84px] w-full grid-cols-[1fr_1px_1fr] overflow-hidden rounded-lg bg-white lg:hidden">
          <div className="flex min-w-0 items-center gap-[clamp(6px,2vw,8px)] px-2.5">
            <div className="flex size-[50px] shrink-0 items-center justify-center rounded-full bg-orange-100">
              <img src={totalExpenseIcon} alt="총 지출" className="size-8" />
            </div>
            <div className="min-w-0">
              <p className="whitespace-nowrap text-mobile-caption font-bold text-gray-600">
                {totalExpenseLabel}
              </p>
              <p className="whitespace-nowrap text-mobile-body font-bold text-gray-900">
                {totalExpense.toLocaleString()}원
              </p>
              <p className="mt-0.5 whitespace-nowrap text-mobile-caption text-gray-500">
                {uniquePayerCount}명 기준
              </p>
            </div>
          </div>

          <div className="my-[13px] bg-gray-100" />

          <div className="flex min-w-0 flex-col justify-center gap-1 px-1.5">
            <div className="flex min-w-0 items-center gap-2">
              <div className="flex size-[26px] shrink-0 items-center justify-center rounded-full bg-orange-100">
                <img src={receiveIcon} alt="받을 금액" className="size-4" />
              </div>
              <div className="min-w-0">
                <p className="whitespace-nowrap text-[8px] font-bold text-gray-600">받을 금액</p>
                <p className="whitespace-nowrap text-mobile-label font-bold text-gray-900">
                  + {receiveAmount.toLocaleString()}원
                </p>
              </div>
            </div>
            <div className="flex min-w-0 items-center gap-2">
              <div className="flex size-[26px] shrink-0 items-center justify-center rounded-full bg-orange-100">
                <img src={payIcon} alt="낼 금액" className="size-[18px]" />
              </div>
              <div className="min-w-0">
                <p className="whitespace-nowrap text-[8px] font-bold text-gray-600">낼 금액</p>
                <p className="whitespace-nowrap text-mobile-label font-bold text-gray-900">
                  - {payAmount.toLocaleString()}원
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 mb-6 flex h-auto w-full flex-col lg:mt-[30px] lg:mb-10 lg:rounded-[20px] lg:bg-white lg:pb-8">
          <div className="w-full lg:px-[30px] lg:pt-[30px]">
            <ExpenseFilterControl
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
              statusFilter={statusFilter}
              onStatusFilterChange={setStatusFilter}
            />
          </div>

          <div className="mt-4 flex w-full flex-col items-start overflow-x-auto lg:mt-[20px] lg:px-[30px] lg:pb-4">
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
                expenses={visibleExpenses}
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
