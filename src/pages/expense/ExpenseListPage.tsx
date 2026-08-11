import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import {
  ExpenseFilterControl,
  ExpenseTable,
  type ExpenseStatusFilter,
  useBankAccounts,
  BankAccountModal,
  maskAccountNumber,
} from '@/features/expense';
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

  const [activeStatus, setActiveStatus] =
    useState<ExpenseStatusFilter>('ALL');

  const [isBankAccountModalOpen, setIsBankAccountModalOpen] = useState(false);

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
    primaryAccount,
    isLoading: isBankAccountLoading,
    isError: isBankAccountError,
    refetch: refetchBankAccounts,
  } = useBankAccounts();

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

  const filteredExpenses = useMemo(
    () =>
      activeStatus === 'ALL'
        ? enrichedExpenses
        : enrichedExpenses.filter(expense => expense.status === activeStatus),
    [enrichedExpenses, activeStatus],
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

        <div className="flex w-full items-stretch rounded-[12px] bg-white shadow-none lg:hidden">
          <div className="flex flex-1 items-center gap-3 px-4 py-4">
            <div className="flex h-[52px] w-[52px] shrink-0 items-center justify-center rounded-full bg-orange-100">
              <img src={totalExpenseIcon} alt="총 지출" className="h-7 w-7" />
            </div>
            <div className="min-w-0">
              <div className="text-[12px] leading-[18px] text-gray-600">
                이번 달 총 지출
              </div>
              <div className="text-[20px] leading-[28px] font-bold text-gray-900">
                {totalExpense.toLocaleString()}원
              </div>
              <div className="mt-0.5 text-[11px] leading-[16px] text-gray-400">
                {uniquePayerCount}명 기준
              </div>
            </div>
          </div>

          <div className="my-4 w-px bg-gray-100" />

          <div className="flex flex-1 flex-col justify-center divide-y divide-gray-100 px-4">
            <div className="flex items-center gap-2 py-2.5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-orange-100">
                <img src={receiveIcon} alt="받을 금액" className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <div className="text-[11px] leading-[16px] text-gray-600">
                  받을 금액
                </div>
                <div className="text-[14px] leading-[20px] font-bold text-gray-900">
                  +{receiveAmount.toLocaleString()}원
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 py-2.5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-orange-100">
                <img src={payIcon} alt="낼 금액" className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <div className="text-[11px] leading-[16px] text-gray-600">
                  낼 금액
                </div>
                <div className="text-[14px] leading-[20px] font-bold text-gray-900">
                  -{payAmount.toLocaleString()}원
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 mb-6 flex h-auto w-full flex-col rounded-[16px] bg-white pb-6 lg:mt-[30px] lg:mb-10 lg:rounded-[20px] lg:pb-8">
          <div className="flex w-full flex-nowrap items-center justify-between gap-3 overflow-x-auto px-3 pt-4 sm:px-4 lg:px-[30px] lg:pt-[30px]">
            <div className="flex min-w-0 flex-1 items-center gap-3 overflow-x-auto">
              <div className="flex shrink-0 items-center gap-2">
                <ExpenseFilterControl
                  activeFilter={activeFilter}
                  onFilterChange={setActiveFilter}
                  activeStatus={activeStatus}
                  onStatusChange={setActiveStatus}
                />
              </div>

              {!isBankAccountLoading && (
                <div className="ml-auto flex shrink-0 items-center gap-1 whitespace-nowrap text-mobile-caption lg:ml-0 lg:text-caption">
                  {isBankAccountError ? (
                    <button
                      type="button"
                      onClick={() => void refetchBankAccounts()}
                      className="font-bold text-red-500 hover:text-red-600"
                    >
                      계좌 조회 실패 · 다시 시도
                    </button>
                  ) : primaryAccount ? (
                    <>
                      <span className="text-gray-700">
                        <span className="lg:hidden">{primaryAccount.bankName}</span>
                        <span className="hidden lg:inline">
                          {primaryAccount.bankName} {maskAccountNumber(primaryAccount.accountNumber)}
                        </span>
                      </span>
                      <button
                        type="button"
                        onClick={() => setIsBankAccountModalOpen(true)}
                        className="ml-1 font-bold text-primary-400 hover:text-primary-500 lg:ml-2"
                      >
                        변경
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setIsBankAccountModalOpen(true)}
                      className="font-bold text-primary-700 hover:text-primary-600"
                    >
                      <span className="lg:hidden">+계좌 등록</span>
                      <span className="hidden lg:inline">+ 정산 받을 계좌 등록</span>
                    </button>
                  )}
                </div>
              )}
            </div>

            <Button
              leftIcon={<Plus size={18} />}
              onClick={() => navigate('/expenses/new')}
              className="hidden shrink-0 lg:flex"
            >
              생활비 등록
            </Button>
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
                expenses={filteredExpenses}
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

      <BankAccountModal
        isOpen={isBankAccountModalOpen}
        onClose={() => setIsBankAccountModalOpen(false)}
      />
    </div>
  );
};

export default ExpenseListPage;