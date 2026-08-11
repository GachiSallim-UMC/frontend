import type { User } from '@/shared/types';
import type { SettlementMethod } from '@/features/expense/types';
import { formatWon } from '@/features/expense/lib/expenseForm.constants';

interface ExpenseMemberOptionProps {
  user: User;
  settlementMethod: SettlementMethod;
  isChecked: boolean;
  isDirectInputCompleted: boolean;
  settlementAmount: number;
  customAmount?: number;
  customRatio?: number;
  amountError?: string;
  ratioError?: string;
  onAmountChange: (value: string) => void;
  onRatioChange: (value: string) => void;
}

export const ExpenseMemberOption = ({
  user,
  settlementMethod,
  isChecked,
  isDirectInputCompleted,
  settlementAmount,
  customAmount,
  customRatio,
  amountError,
  ratioError,
  onAmountChange,
  onRatioChange,
}: ExpenseMemberOptionProps) => {
  const isCustom = settlementMethod === 'CUSTOM';
  const isRatio = settlementMethod === 'RATIO';

  return (
    <div className="flex w-full flex-wrap items-center gap-2">
      <span>{user.name}</span>

      {settlementMethod === 'EQUAL' && (
        <span className="font-normal text-button text-gray-800">
          - {formatWon(settlementAmount)}
        </span>
      )}

      {isCustom && isChecked && !isDirectInputCompleted && (
        <div className="ml-2 flex items-center gap-2">
          <span className="font-normal text-button text-gray-800">-</span>
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={10}
            placeholder="금액"
            value={customAmount ?? ''}
            onChange={event => onAmountChange(event.target.value)}
            className={`h-[26px] w-[80px] rounded border bg-white px-2 text-right text-caption font-normal text-gray-800 outline-none focus:border-gray-400 ${
              amountError ? 'border-red-500' : 'border-gray-200'
            }`}
          />
          {amountError && <span className="text-xs text-red-500">{amountError}</span>}
        </div>
      )}

      {isCustom && (isDirectInputCompleted || !isChecked) && (
        <span className="font-normal text-button text-gray-800">
          - {formatWon(settlementAmount)}
        </span>
      )}

      {isRatio && isChecked && !isDirectInputCompleted && (
        <div className="ml-2 flex items-center gap-2">
          <span className="font-normal text-button text-gray-800">-</span>
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={3}
            placeholder="비율"
            value={customRatio ?? ''}
            onChange={event => onRatioChange(event.target.value)}
            className={`h-[26px] w-[60px] rounded border bg-white px-2 text-right text-caption font-normal text-gray-800 outline-none focus:border-gray-400 ${
              ratioError ? 'border-red-500' : 'border-gray-200'
            }`}
          />
          {ratioError && <span className="text-xs text-red-500">{ratioError}</span>}
          <span className="font-normal text-button text-gray-800">%</span>
        </div>
      )}

      {isRatio && (isDirectInputCompleted || !isChecked) && (
        <span className="font-normal text-button text-gray-800">
          - {customRatio || 0}% ({formatWon(settlementAmount)})
        </span>
      )}
    </div>
  );
};
