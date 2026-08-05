import SettingIcon from '@/assets/icons/sidebar/group-settings.svg?react';
import { ConfirmModal } from '@/shared/components/ui/ConfirmModal';

interface KickOutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isSaving?: boolean;
  memberName?: string;
  errorMessage?: string | null;
}

export const KickOutModal = ({
  isOpen,
  onClose,
  onConfirm,
  isSaving = false,
  memberName,
  errorMessage,
}: KickOutModalProps) => {
  return (
    <ConfirmModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      icon={<SettingIcon className="size-6 [&_*]:!fill-current" />}
      title="멤버를 내보내시겠습니까?"
      highlight={memberName}
      description={
        <div className="flex flex-col items-center gap-1">
          <span>님은 그룹에서 제거됩니다.</span>
          {errorMessage && <span className="text-sm text-red-700">{errorMessage}</span>}
        </div>
      }
      confirmLabel="내보내기"
      isPending={isSaving}
      tone="danger"
    />
  );
};
