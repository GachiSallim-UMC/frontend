import ChoreIcon from '@/assets/icons/sidebar/chores-active.svg?react';
import { ConfirmModal } from '@/shared/components';

interface ChoreCancelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const ChoreCancelModal = ({ isOpen, onClose, onConfirm }: ChoreCancelModalProps) => (
  <ConfirmModal
    isOpen={isOpen}
    onClose={onClose}
    onConfirm={onConfirm}
    icon={<ChoreIcon className="size-6" />}
    title="작성을 취소할까요?"
    description="작성 중인 내용은 저장되지 않으며, 이전 페이지로 돌아갑니다."
    confirmLabel="나가기"
    cancelLabel="계속 작성"
  />
);
