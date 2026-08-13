import ExpenseIcon from '@/assets/icons/sidebar/expenses.svg?react';
import { FormCancelModal } from '@/shared/components';

interface ExpenseCancelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isPending?: boolean;
}

export const ExpenseCancelModal = ({
  isOpen,
  onClose,
  onConfirm,
  isPending = false,
}: ExpenseCancelModalProps) => (
  <FormCancelModal
    isOpen={isOpen}
    onClose={onClose}
    onConfirm={onConfirm}
    icon={<ExpenseIcon className="size-6" />}
    isPending={isPending}
  />
);
