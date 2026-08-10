import type { ReactNode } from 'react';
import { ConfirmModal } from '../ConfirmModal';

interface FormCancelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  icon: ReactNode;
  isPending?: boolean;
}

/** 변경된 폼에서 이탈하기 전에 공통 문구와 동작으로 확인합니다. */
export const FormCancelModal = ({
  isOpen,
  onClose,
  onConfirm,
  icon,
  isPending = false,
}: FormCancelModalProps) => (
  <ConfirmModal
    isOpen={isOpen}
    onClose={onClose}
    onConfirm={onConfirm}
    icon={icon}
    title="작성을 취소할까요?"
    description="작성 중인 내용은 저장되지 않으며, 이전 페이지로 돌아갑니다."
    confirmLabel="나가기"
    cancelLabel="계속 작성"
    isPending={isPending}
    closeOnOverlayClick
  />
);
