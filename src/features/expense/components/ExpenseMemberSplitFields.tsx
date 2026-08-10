import type { SettlementMethod } from '@/features/expense/types';
import { CheckboxGroup, SelectDropdown, type CheckboxOption } from '@/shared/components/form';
import { SPLIT_METHOD_OPTIONS, formatWon } from '@/features/expense/lib/expenseForm.constants';
import { EXPENSE_FORM_LABEL_CLASS } from './expenseForm.styles';

interface ExpenseMemberSplitFieldsProps {
  settlementMethod: SettlementMethod;
  isDirectInputCompleted: boolean;
  totalRatioSum: number;
  totalCustomSum: number;
  numericTotalAmount: number;
  membersLoading?: boolean;
  memberOptions: CheckboxOption<string>[];
  checkedMembers: string[];
  membersError?: string;
  onMethodChange: (method: SettlementMethod) => void;
  onCompleteDirectInput: () => void;
  onEditDirectInput: () => void;
  onMembersChange: (memberIds: string[]) => void;
}

export const ExpenseMemberSplitFields = ({
  settlementMethod,
  isDirectInputCompleted,
  totalRatioSum,
  totalCustomSum,
  numericTotalAmount,
  membersLoading,
  memberOptions,
  checkedMembers,
  membersError,
  onMethodChange,
  onCompleteDirectInput,
  onEditDirectInput,
  onMembersChange,
}: ExpenseMemberSplitFieldsProps) => {
  const isCustom = settlementMethod === 'CUSTOM';
  const isRatio = settlementMethod === 'RATIO';

  return (
    <>
      <SelectDropdown
        label="분담 방식"
        required
        inputSize="sm"
        value={settlementMethod}
        onChange={value => onMethodChange(value as SettlementMethod)}
        options={SPLIT_METHOD_OPTIONS}
        placeholder=""
      />

      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <label className={EXPENSE_FORM_LABEL_CLASS}>정산 대상 멤버 *</label>

          {(isCustom || isRatio) && !isDirectInputCompleted && (
            <div className="flex flex-wrap items-center gap-3">
              {isRatio ? (
                <span className="text-caption text-gray-600">
                  합계: <strong className="text-gray-800">{totalRatioSum}%</strong> / 100%
                </span>
              ) : (
                <span className="text-caption text-gray-600">
                  합계: <strong className="text-gray-800">{formatWon(totalCustomSum)}</strong> /
                  총액: {formatWon(numericTotalAmount)}
                </span>
              )}

              <button
                type="button"
                onClick={onCompleteDirectInput}
                className="rounded bg-gray-800 px-3 py-1 text-caption font-bold text-white hover:bg-gray-700"
              >
                완료
              </button>
            </div>
          )}

          {(isCustom || isRatio) && isDirectInputCompleted && (
            <button
              type="button"
              onClick={onEditDirectInput}
              className="rounded border border-gray-300 px-3 py-1 text-caption text-gray-700 hover:bg-gray-50"
            >
              수정하기
            </button>
          )}
        </div>

        <div
          className={`flex flex-col gap-1.5 rounded-lg ${
            membersError ? 'border border-red-500 p-2' : ''
          }`}
        >
          {membersLoading ? (
            <div className="py-2 text-caption text-gray-400">멤버 목록을 불러오는 중...</div>
          ) : (
            <CheckboxGroup
              options={memberOptions}
              value={checkedMembers}
              onChange={onMembersChange}
              direction="col"
              size="sm"
            />
          )}
        </div>

        {membersError && <p className="text-xs text-red-500">{membersError}</p>}
      </div>
    </>
  );
};
