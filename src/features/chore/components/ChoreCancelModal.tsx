import ChoreIcon from '@/assets/icons/sidebar/chores.svg?react';
import { FormCancelModal } from '@/shared/components';

interface ChoreCancelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isPending?: boolean;
}

export const ChoreCancelModal = ({
  isOpen,
  onClose,
  onConfirm,
  isPending = false,
}: ChoreCancelModalProps) => (
  <FormCancelModal
    isOpen={isOpen}
    onClose={onClose}
    onConfirm={onConfirm}
    icon={<ChoreIcon className="size-6" />}
    isPending={isPending}
  />
);
