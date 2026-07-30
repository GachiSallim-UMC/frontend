import { useState } from 'react';
import TossIcon from '@/assets/icons/expense/toss.svg?react';
import {
  CustomButton,
  IconTextButton,
  SettlementConfirm,
} from '@/features/expense';
import { useCreatePayLink, useExpenseSettle } from '@/features/expense';
import type { Expense } from '@/features/expense';

interface SettlementPreviewCardProps {
  expense?: Expense;
  currentUserId?: string;
  onRefresh?: () => void;
}

export const SettlementPreviewCard = ({
  expense,
  currentUserId,
  onRefresh,
}: SettlementPreviewCardProps) => {
  const [isSettlementConfirmOpen, setIsSettlementConfirmOpen] = useState(false);

  const { requestPayLink, isLoading } = useCreatePayLink();
  const { handleBulkSettle } = useExpenseSettle(expense, onRefresh);

  if (!expense) {
    return (
      <div className="w-full bg-white p-[24px] rounded-[18px] flex items-center justify-center text-gray-500 border border-gray-100">
        입력된 내역의 정산 미리보기가 없습니다.
      </div>
    );
  }

  const shares = expense.shares ?? [];
  const displayAmount = typeof expense.amount === 'number' ? expense.amount : 0;
  const memberCount = shares.length || 1;
  const isDirectSplit =
    expense.splitType === 'CUSTOM' || expense.splitType === 'RATIO';
  const equalPerPerson = Math.floor(displayAmount / memberCount);

  const myShare = shares.find(
    (s) => String(s.user.id) === String(currentUserId),
  );

  return (
    <>
      <div className="w-full bg-white p-[24px] rounded-[18px] flex flex-col gap-5 border border-primary-600">
        <h2 className="font-sans text-body font-bold text-gray-800">
          정산 상세 미리보기
        </h2>

        <div className="flex flex-col gap-3">
          <span className="text-button font-bold text-gray-800">
            구매내역
          </span>

          <div className="flex flex-col gap-2 text-button text-gray-900">
            <div className="flex justify-between items-center">
              <span>{expense.title || '항목명 미입력'}</span>

              {!isDirectSplit ? (
                <span className="text-gray-900">
                  {displayAmount.toLocaleString()} / {memberCount} ={' '}
                  {equalPerPerson.toLocaleString()}원
                </span>
              ) : (
                <span className="text-gray-900">
                  {displayAmount.toLocaleString()}원 (
                  {splitTypeLabel(expense)})
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="border-b border-dashed border-gray-900 my-1" />

        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center font-bold text-button">
            <span className="text-gray-800">
              {isDirectInputSummaryLabel(expense)}
            </span>

            <span className="text-primary-700 text-lg">
              {isDirectSplit
                ? `${shares
                    .reduce((acc, cur) => Math.max(acc, cur.amount), 0)
                    .toLocaleString()}원 등`
                : `${equalPerPerson.toLocaleString()}원`}
            </span>
          </div>

          {isDirectSplit && (
            <div className="flex flex-col gap-1 mt-1 bg-gray-100 p-3 rounded-lg">
              {shares.length === 0 ? (
                <div className="text-caption text-gray-400">
                  분담 내역이 없습니다.
                </div>
              ) : (
                shares.map((share) => (
                  <div
                    key={share.user.id}
                    className="flex justify-between text-caption text-gray-700"
                  >
                    <span>{share.user.name}</span>
                    <span>{share.amount.toLocaleString()}원</span>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-3 mt-2">
          <IconTextButton
            label={isLoading ? '송금 링크 생성 중...' : '토스로 송금'}
            variant="toss"
            iconComponent={TossIcon}
            onClick={() => requestPayLink(myShare)}
            className="flex-1"
          />

          <CustomButton
            label="정산하기"
            variant="settlement"
            onClick={() => setIsSettlementConfirmOpen(true)}
            className="flex-1 h-[50px] rounded-[8px]"
          />
        </div>
      </div>

      <SettlementConfirm
        isOpen={isSettlementConfirmOpen}
        onClose={() => setIsSettlementConfirmOpen(false)}
        onConfirm={handleBulkSettle}
      />
    </>
  );
};

function splitTypeLabel(expense: Expense): string {
  if (expense.splitType === 'RATIO') return '비율 분할';
  if (expense.splitType === 'CUSTOM') return '직접 입력';
  return '균등 분할';
}

function isDirectInputSummaryLabel(expense: Expense): string {
  return expense.splitType === 'CUSTOM' || expense.splitType === 'RATIO'
    ? '멤버별 부담 금액'
    : '1인당 부담 금액';
}