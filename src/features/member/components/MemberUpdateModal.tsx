import SettingIcon from '@/assets/icons/sidebar/group-settings.svg?react';
import { ConfirmModal } from '@/shared/components/ui/ConfirmModal';

interface MemberUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isSaving?: boolean;
  errorMessage?: string | null;
}

export const MemberUpdateModal = ({
  isOpen,
  onClose,
  onConfirm,
  isSaving = false,
  errorMessage,
}: MemberUpdateModalProps) => {
  return (
    <ConfirmModal
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={onConfirm}
      icon={<SettingIcon className="size-6 [&_*]:!fill-current" />}
      title="그룹 설정을 수정할까요?"
      description={
        <div className="flex flex-col items-center gap-1">
          <span>입력하신 내용으로 그룹 데이터를 수정합니다.</span>
          {errorMessage && <span className="text-sm text-red-700">{errorMessage}</span>}
        </div>
      }
      confirmLabel="수정하기"
      isPending={isSaving}
      tone="edit"
    />
  );
};
