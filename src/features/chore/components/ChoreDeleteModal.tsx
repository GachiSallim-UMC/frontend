import ChoreIcon from '@/assets/icons/sidebar/chores.svg?react';
import { ConfirmModal } from '@/shared/components';

interface ChoreDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  choreName: string;
  isDeleting?: boolean;
  /** 삭제 실패 사유. 모달을 열어둔 채 안에서 보여줍니다. */
  errorMessage?: string;
}

export const ChoreDeleteModal = ({
  isOpen,
  onClose,
  onConfirm,
  choreName,
  isDeleting = false,
  errorMessage,
}: ChoreDeleteModalProps) => (
  <ConfirmModal
    isOpen={isOpen}
    onClose={onClose}
    onConfirm={onConfirm}
    tone="danger"
    icon={<ChoreIcon className="size-6" />}
    title="정말 삭제하시겠어요?"
    highlight={choreName}
    description="데이터를 삭제합니다. 삭제된 데이터는 복구할 수 없습니다."
    confirmLabel="영구 삭제"
    isPending={isDeleting}
    errorMessage={errorMessage}
  />
);
