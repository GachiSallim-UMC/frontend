import ExpenseIcon from '@/assets/icons/sidebar/expenses.svg?react';
import { ConfirmModal } from '@/shared/components';

interface ExpenseDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  expenseName: string;
  isDeleting?: boolean;
  errorMessage?: string;
}

export const ExpenseDeleteModal = ({
  isOpen,
  onClose,
  onConfirm,
  expenseName,
  isDeleting = false,
  errorMessage,
}: ExpenseDeleteModalProps) => (
  <ConfirmModal
    isOpen={isOpen}
    onClose={onClose}
    onConfirm={onConfirm}
    tone="danger"
    icon={<ExpenseIcon className="size-6" />}
    title="정말 삭제하시겠어요?"
    highlight={expenseName}
    description="데이터를 삭제합니다. 삭제된 데이터는 복구할 수 없습니다."
    confirmLabel="영구 삭제"
    isPending={isDeleting}
    errorMessage={errorMessage}
  />
);