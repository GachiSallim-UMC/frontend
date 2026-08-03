import { useState } from 'react';
import {
  CustomButton,
  CheckboxModal,
  SettlementConfirm,
} from '@/features/expense';
import { StatusBadge } from '@/shared/components';
import { formatDate, useDateFormat } from '@/shared/lib';
import { useExpenseSettle } from '@/features/expense';
import type { Expense } from '@/features/expense';

interface ExpenseDetailCardProps {
  expense?: Expense;
  onRefresh?: () => void;
}

export function ExpenseDetailCard({
  expense,
  onRefresh,
}: ExpenseDetailCardProps) {
  const [isSettlementConfirmOpen, setIsSettlementConfirmOpen] = useState(false);
  const dateFormat = useDateFormat();

  const {
    isModalOpen,
    setIsModalOpen,
    handleBulkSettle,
    handleIndividualSubmit,
    modalMembers,
  } = useExpenseSettle(expense, onRefresh);

  if (!expense) {
    return (
      <div className="w-full bg-white p-[24px] rounded-[18px] flex items-center justify-center text-gray-500">
        선택된 지출 상세 내역이 없습니다.
      </div>
    );
  }

  const shares = expense.shares ?? [];
  const displayAmount =
    typeof expense.amount === 'number' ? expense.amount : 0;

  const getSplitTypeText = (type: Expense['splitType']) => {
    switch (type) {
      case 'EQUAL':
        return '균등 분할 (n/n)';
      case 'CUSTOM':
        return '직접 입력';
      case 'RATIO':
        return '비율 분할 (%)';
      default:
        return '균등 분할 (n/n)';
    }
  };

  const formatExpenseDate = (dateString: string): string => {
    if (!dateString) return '-';
    return formatDate(dateString, dateFormat);
  };

  return (
    <>
      <div className="w-full bg-white p-[24px] rounded-[18px] flex flex-col gap-6 relative">
        <h2 className="font-sans text-body font-bold text-gray-800">
          정산 상세
        </h2>

        <div className="flex flex-col gap-3 text-button text-gray-900">
          <div className="border-b border-gray-100 p-2 flex justify-between">
            <span className="text-gray-900">항목</span>
            <span>{expense.title || '제목 없음'}</span>
          </div>

          <div className="border-b border-gray-100 p-2 flex justify-between">
            <span className="text-gray-900">총액</span>
            <span>{displayAmount.toLocaleString()}원</span>
          </div>

          <div className="border-b border-gray-100 p-2 flex justify-between">
            <span className="text-gray-900">선지불자</span>
            <span>{expense.payer?.name || '알 수 없음'}</span>
          </div>

          <div className="border-b border-gray-100 p-2 flex justify-between">
            <span className="text-gray-900">지출일</span>
            <span>{formatExpenseDate(expense.date)}</span>
          </div>

          <div className="border-b border-gray-100 p-2 flex justify-between">
            <span className="text-gray-900">분담 방식</span>
            <span>{getSplitTypeText(expense.splitType)}</span>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <span className="font-sans text-body font-bold text-gray-800">
            멤버별 부담금
          </span>

          <div className="flex flex-col gap-3 text-button text-black">
            {shares.length === 0 ? (
              <div className="text-caption text-gray-400 p-2">
                분담 내역이 없습니다.
              </div>
            ) : (
              shares.map((share) => {
                const isPayer = share.user.id === expense.payer?.id;

                let badgeVariant: 'done' | 'pending' = 'pending';
                let badgeLabel = '미납';

                if (isPayer) {
                  badgeVariant = 'done';
                  badgeLabel = '선지불';
                } else if (share.isPaid) {
                  badgeVariant = 'done';
                  badgeLabel = '완료';
                }

                return (
                  <div
                    key={share.user.id}
                    className="p-2 border-b border-gray-100 last:border-gray-900 last:border-b-[2px] flex justify-between items-center"
                  >
                    <span>{share.user.name}</span>

                    <div className="flex items-center gap-3">
                      <span>{share.amount.toLocaleString()}원</span>
                      <StatusBadge
                        variant={badgeVariant}
                        label={badgeLabel}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="flex justify-between font-bold text-body text-gray-800">
          <span>합계</span>
          <span>{displayAmount.toLocaleString()}원</span>
        </div>

        <div className="flex gap-3 mt-2">
          <CustomButton
            label="전체 정산 완료"
            variant="all"
            onClick={() => setIsSettlementConfirmOpen(true)}
            className="w-[136px]"
          />

          <CustomButton
            label="개별 완료 처리"
            variant="each"
            onClick={() => setIsModalOpen(true)}
            className="w-[136px]"
          />
        </div>

        <CheckboxModal
          title="개별 정산 완료 처리"
          description="정산이 완료된 멤버를 선택해주세요."
          members={modalMembers}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSubmit={handleIndividualSubmit}
        />
      </div>

      <SettlementConfirm
        isOpen={isSettlementConfirmOpen}
        onClose={() => setIsSettlementConfirmOpen(false)}
        onConfirm={handleBulkSettle}
      />
    </>
  );
}