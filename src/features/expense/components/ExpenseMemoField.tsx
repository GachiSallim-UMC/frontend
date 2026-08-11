import { TextArea } from '@/shared/components/form';
import { MEMO_MAX_LENGTH } from '@/features/expense/lib/expenseForm.constants';

interface ExpenseMemoFieldProps {
  value: string;
  error?: string;
  isEditMode: boolean;
  onChange: (value: string) => void;
}

export const ExpenseMemoField = ({ value, error, isEditMode, onChange }: ExpenseMemoFieldProps) => (
  <TextArea
    label="메모"
    value={value}
    onChange={event => onChange(event.target.value)}
    placeholder="예: 장보기, 전기요금"
    maxLength={MEMO_MAX_LENGTH}
    error={error}
    disabled={isEditMode}
    className={isEditMode ? 'cursor-not-allowed bg-gray-100 text-gray-400' : undefined}
    showCount
    countInside
  />
);
