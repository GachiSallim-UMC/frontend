import SettingIcon from '@/assets/icons/sidebar/group-settings.svg?react';
import { ConfirmModal } from '@/shared/components/ui/ConfirmModal';

interface DelegateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isSaving?: boolean;
  memberName?: string;
}

export const DelegateAdminModal = ({
  isOpen,
  onClose,
  onConfirm,
  isSaving = false,
  memberName,
}: DelegateModalProps) => {
  return (
    <ConfirmModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      icon={<SettingIcon className="size-6 [&_*]:!fill-current" />}
      title="관리자 권한을 위임할까요?"
      highlight={memberName}
      description="님에게 그룹 관리 권한이 부여됩니다."
      confirmLabel="위임하기"
      isPending={isSaving}
      tone="default"
    />
  );
};
