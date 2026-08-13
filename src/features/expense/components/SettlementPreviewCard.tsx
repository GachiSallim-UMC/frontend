import { useState } from 'react';
import TossIcon from '@/assets/icons/expense/toss.svg?react';
import ExpenseIcon from '@/assets/icons/sidebar/expenses.svg?react';
import { CustomButton } from '@/features/expense/components/CustomButton';
import { IconTextButton } from '@/features/expense/components/IconTextButton';
import { SettlementConfirm } from '@/features/expense/components/SettlementConfirm';
import { useClaimTransferComplete } from '@/features/expense/hooks/useClaimTransferComplete';
import { useCreatePayLink } from '@/features/expense/hooks/useCreatePayLink';
import { useExpenseSettle } from '@/features/expense/hooks/useExpenseSettle';
import type { Expense } from '@/features/expense/types/expense.types';
import { useAlertStore } from '@/shared/store';

interface SettlementDraft {
  title: string;
  amount: string;
  payerName?: string;
  splitType: string;
}

interface SettlementPreviewCardProps {
  expense?: Expense;
  currentUserId?: string;
  onRefresh?: () => void;
  /**
   * 저장 전(등록 화면) 상태에서 폼에 입력 중인 값의 미리보기.
   * expense가 없을 때 모바일 화면에서만 간단히 노출된다.
   */
  draft?: SettlementDraft;
}

function settlementMethodLabel(value?: string): string {
  if (value === 'RATIO') return '비율 분할 (%)';
  if (value === 'CUSTOM') return '직접 입력';
  return '균등 분할 (n/n)';
}

export const SettlementPreviewCard = ({
  expense,
  currentUserId,
  onRefresh,
  draft,
}: SettlementPreviewCardProps) => {
  const [isSettlementConfirmOpen, setIsSettlementConfirmOpen] =
    useState(false);

  const {
    requestPayLink,
    isLoading: isPayLinkLoading,
  } = useCreatePayLink();

  const { handleBulkSettle } = useExpenseSettle(
    expense,
    onRefresh,
  );

  const {
    requestTransferComplete,
    isLoading: isClaimTransferLoading,
  } = useClaimTransferComplete();

  const handleTransferComplete = async (
    shareId: number | string,
  ) => {
    const success = await requestTransferComplete(shareId);

    if (success) {
      useAlertStore.getState().showAlert({
        title: '완료',
        message: '송금 완료 알림을 성공적으로 보냈습니다.',
        tone: 'success',
      });

      onRefresh?.();
    } else {
      useAlertStore.getState().showAlert({
        title: '오류',
        message: '송금 완료 처리에 실패했습니다. 다시 시도해 주세요.',
        tone: 'error',
      });
    }
  };

  if (!expense) {
    const hasDraftContent = Boolean(
      draft?.title || draft?.amount,
    );

    return (
      <>
        {/* 모바일: 저장 전에도 입력 중인 값으로 간단 미리보기 표시 */}
        <div className="sm:hidden">
          {hasDraftContent ? (
            <div className="w-full rounded-[16px] bg-white p-3">
              <div className="mb-3 flex items-center gap-2">
                <ExpenseIcon className="size-6" />

                <span className="text-subtitle font-bold text-gray-900">
                  정산 상세 미리보기
                </span>
              </div>

              <div className="flex flex-col text-button text-gray-900">
                <div className="flex justify-between border-b border-gray-100 py-2">
                  <span className="text-gray-600">
                    항목
                  </span>

                  <span className="truncate pl-2 text-right">
                    {draft?.title || '제목 없음'}
                  </span>
                </div>

                <div className="flex justify-between border-b border-gray-100 py-2">
                  <span className="text-gray-600">
                    총액
                  </span>

                  <span>
                    {(Number(draft?.amount) || 0).toLocaleString()}
                    원
                  </span>
                </div>

                <div className="flex justify-between border-b border-gray-100 py-2">
                  <span className="text-gray-600">
                    선지불자
                  </span>

                  <span>
                    {draft?.payerName || '미선택'}
                  </span>
                </div>

                <div className="flex justify-between py-2">
                  <span className="text-gray-600">
                    분담 방식
                  </span>

                  <span>
                    {settlementMethodLabel(
                      draft?.splitType,
                    )}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-caption text-gray-500">
              입력된 내역의 정산 미리보기가 없습니다.
            </div>
          )}
        </div>

        {/* 데스크톱: 기존 안내 문구 유지 */}
        <div className="hidden text-center text-caption text-gray-500 sm:block">
          입력된 내역의 정산 미리보기가 없습니다.
        </div>
      </>
    );
  }

  const shares = expense.shares ?? [];

  const displayAmount =
    typeof expense.amount === 'number'
      ? expense.amount
      : 0;

  const memberCount = shares.length || 1;

  const isDirectSplit =
    expense.splitType === 'CUSTOM' ||
    expense.splitType === 'RATIO';

  const equalPerPerson = Math.floor(
    displayAmount / memberCount,
  );

  const myShare = shares.find(
    share =>
      String(share.user.id) ===
      String(currentUserId),
  );

  // 선지불자(=정산 생성 시 먼저 돈을 낸 사람) 본인인지 여부
  const isPayer =
    Boolean(currentUserId) &&
    String(expense.payer?.id) ===
      String(currentUserId);

  return (
    <>
      <div className="w-full sm:bg-white p-3 sm:rounded-[18px] sm:border sm:border-gray-100 sm:p-5 lg:p-[32px]">
        <h2 className="mb-4 text-subtitle font-bold text-gray-800">
          정산 상세 미리보기
        </h2>

        <div className="flex flex-col gap-3">
          <span className="text-button font-bold text-gray-800">
            구매내역
          </span>

          <div className="flex flex-col gap-2 text-button text-gray-900">
            <div className="flex flex-wrap items-center justify-between gap-1">
              <span>
                {expense.title || '항목명 미입력'}
              </span>

              {!isDirectSplit ? (
                <span className="text-gray-900">
                  {displayAmount.toLocaleString()} /{' '}
                  {memberCount} ={' '}
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

        <div className="my-1 border-b border-dashed border-gray-900" />

        <div className="flex flex-col gap-2">
          <div className="flex flex-wrap items-center justify-between gap-1 font-bold text-button">
            <span className="text-gray-800">
              {isDirectInputSummaryLabel(expense)}
            </span>

            <span className="text-lg text-primary-700">
              {isDirectSplit
                ? `${shares
                    .reduce(
                      (acc, cur) =>
                        Math.max(acc, cur.amount),
                      0,
                    )
                    .toLocaleString()}원 등`
                : `${equalPerPerson.toLocaleString()}원`}
            </span>
          </div>

          {isDirectSplit && (
            <div className="mt-1 flex flex-col gap-1 rounded-lg bg-gray-100 p-3">
              {shares.length === 0 ? (
                <div className="text-caption text-gray-400">
                  분담 내역이 없습니다.
                </div>
              ) : (
                shares.map(share => (
                  <div
                    key={share.user.id}
                    className="flex justify-between text-caption text-gray-700"
                  >
                    <span>{share.user.name}</span>

                    <span>
                      {share.amount.toLocaleString()}원
                    </span>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* 송금 / 송금 완료 / 정산하기 */}
        <div className="mt-4 flex flex-col gap-1">
          {/* 선지불자가 아니고, 아직 자기 몫을 안 낸 경우 */}
          {!isPayer &&
            myShare &&
            !myShare.isPaid && (
              <>
                {/* 토스로 송금 */}
                <IconTextButton
                  label={
                    isPayLinkLoading
                      ? '송금 링크 생성 중...'
                      : '토스로 송금'
                  }
                  variant="toss"
                  iconComponent={TossIcon}
                  onClick={() =>
                    requestPayLink(myShare)
                  }
                  className="w-full"
                  disabled={isPayLinkLoading}
                />

                {/* 송금 완료했어요 */}
                <button
                  type="button"
                  onClick={() =>
                    void handleTransferComplete(
                      myShare.id,
                    )
                  }
                  disabled={
                    isClaimTransferLoading
                  }
                  className="w-full py-1 text-center text-[12px] text-primary-500 underline underline-offset-2 transition-colors hover:text-primary-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isClaimTransferLoading
                    ? '전송 중...'
                    : '송금 완료했어요'}
                </button>
              </>
            )}

          {/* 선지불자 본인에게만 정산하기 표시 */}
          {isPayer && (
            <CustomButton
              label="정산하기"
              variant="settlement"
              onClick={() =>
                setIsSettlementConfirmOpen(true)
              }
              className="hidden h-[50px] rounded-[8px] sm:flex sm:w-full"
            />
          )}
        </div>
      </div>

      <SettlementConfirm
        isOpen={isSettlementConfirmOpen}
        onClose={() =>
          setIsSettlementConfirmOpen(false)
        }
        onConfirm={handleBulkSettle}
      />
    </>
  );
};

function splitTypeLabel(expense: Expense): string {
  if (expense.splitType === 'RATIO') {
    return '비율 분할';
  }

  if (expense.splitType === 'CUSTOM') {
    return '직접 입력';
  }

  return '균등 분할';
}

function isDirectInputSummaryLabel(
  expense: Expense,
): string {
  return expense.splitType === 'CUSTOM' ||
    expense.splitType === 'RATIO'
    ? '멤버별 부담 금액'
    : '1인당 부담 금액';
}
