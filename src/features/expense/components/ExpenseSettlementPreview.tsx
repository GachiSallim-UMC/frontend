import ExpenseIcon from '@/assets/icons/sidebar/expenses.svg?react';
import { CustomButton } from '@/features/expense/components/CustomButton';
import type { SettlementMethod } from '@/features/expense/types';
import { SPLIT_METHOD_OPTIONS } from '@/features/expense/lib/expenseForm.constants';
import type { User } from '@/shared/types';

interface ExpenseSettlementPreviewProps {
  title: string;
  amount: string;
  payerId: string;
  members: User[];
  settlementMethod: SettlementMethod;
  isEditMode: boolean;
  /** 현재 로그인한 사용자가 선지불자 본인인지 여부. true일 때만 정산 완료 버튼을 노출한다. */
  isPayer: boolean;
  onBulkSettle: () => void;
  onIndividualSettle: () => void;
}

export const ExpenseSettlementPreview = ({
  title,
  amount,
  payerId,
  members,
  settlementMethod,
  isEditMode,
  isPayer,
  onBulkSettle,
  onIndividualSettle,
}: ExpenseSettlementPreviewProps) => (
  <div className="flex flex-col gap-3 border-t border-dashed border-gray-200 pt-4">
    <div className="flex items-center gap-2">
      <ExpenseIcon className="size-5" />
      <span className="font-sans text-body font-bold text-gray-800">정산 미리보기</span>
    </div>

    <div className="flex flex-col text-button text-gray-900">
      <div className="flex justify-between border-b border-gray-100 py-2">
        <span className="text-gray-600">항목</span>
        <span className="truncate pl-2 text-right">{title.trim() || '항목명 미입력'}</span>
      </div>
      <div className="flex justify-between border-b border-gray-100 py-2">
        <span className="text-gray-600">총액</span>
        <span>{(Number(amount) || 0).toLocaleString()}원</span>
      </div>
      <div className="flex justify-between border-b border-gray-100 py-2">
        <span className="text-gray-600">선지불자</span>
        <span>{members.find(member => String(member.id) === payerId)?.name ?? '미선택'}</span>
      </div>
      <div className="flex justify-between py-2">
        <span className="text-gray-600">분담 방식</span>
        <span>
          {SPLIT_METHOD_OPTIONS.find(option => option.value === settlementMethod)?.label ??
            '균등 분할 (n/n)'}
        </span>
      </div>
    </div>

    {isEditMode && isPayer && (
  <div className="flex gap-3 pt-1">
    <CustomButton
      label="전체 정산 완료"
      variant="all"
      onClick={onBulkSettle}
      className="flex-1"
    />

    <CustomButton
      label="개별 완료 처리"
      variant="each"
      onClick={onIndividualSettle}
      className="flex-1"
    />
  </div>
)}
  </div>
);