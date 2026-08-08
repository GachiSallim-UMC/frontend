import ExpenseIcon from '@/assets/icons/sidebar/expenses.svg?react';
import { ConfirmModal } from '@/shared/components';

interface ExpenseSaveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  expenseName: string;
  isSaving?: boolean;
  /** 저장 실패 사유. 모달을 열어둔 채 안에서 보여줍니다. */
  errorMessage?: string;
  /** 등록/수정에 따라 문구가 달라집니다. */
  mode?: 'create' | 'update';
}

export const ExpenseSaveModal = ({
  isOpen,
  onClose,
  onConfirm,
  expenseName,
  isSaving = false,
  errorMessage,
  mode = 'create',
}: ExpenseSaveModalProps) => {
  const isCreate = mode === 'create';

  return (
    <ConfirmModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      icon={<ExpenseIcon className="size-6" />}
      title={isCreate ? '생활비를 등록할까요?' : '생활비를 수정할까요?'}
      highlight={expenseName}
      description={isCreate ? '내용으로 생활비를 등록합니다.' : '생활비 데이터를 수정합니다.'}
      confirmLabel={isCreate ? '저장하기' : '수정하기'}
      isPending={isSaving}
      errorMessage={errorMessage}
      tone={isCreate ? 'default' : 'edit'}
    />
  );
};