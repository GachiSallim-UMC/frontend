import ChoreIcon from '@/assets/icons/sidebar/chores-active.svg?react';
import { ConfirmModal } from '@/shared/components';

interface ChoreDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  choreName: string;
  isDeleting?: boolean;
}

export const ChoreDeleteModal = ({
  isOpen,
  onClose,
  onConfirm,
  choreName,
  isDeleting = false,
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
  />
);
