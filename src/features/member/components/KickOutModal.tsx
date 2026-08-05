import SettingIcon from '@/assets/icons/sidebar/group-settings.svg?react';
import { Button, Modal } from '@/shared/components';

interface KickOutModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isSaving?: boolean;
  memberName?: string;
}

export const KickOutModal = ({
  isOpen,
  onClose,
  onConfirm,
  isSaving = false,
  memberName,
}: KickOutModalProps) => {
  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      dismissible={false}
      className="flex h-[335px] w-[500px] max-w-none flex-col items-center rounded-[20px] p-0 overflow-hidden bg-white"
    >
      {/* 상단 아이콘 영역 */}
      <div className="mt-[40px] flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-full bg-red-100">
        <SettingIcon className="h-[24px] w-[24px] text-red-700 [&_*]:!fill-current" />
      </div>

      {/* 텍스트 영역 */}
      <div className="mt-[20px] flex flex-col items-center text-center px-6">
        <h1 className="mb-1 text-[24px] font-bold text-gray-900">멤버를 내보내시겠습니까?</h1>
        <p className="text-[14px] leading-relaxed text-gray-600">
          <span className="font-bold text-gray-600">"{memberName}"</span>님은 그룹에서 제거됩니다.
        </p>
      </div>

      {/* 버튼 영역*/}
      <div className="mt-auto flex w-full gap-3 border-t border-gray-100 px-[40px] py-[27px]">
        <Button
          variant="primary"
          size="lg"
          isLoading={isSaving}
          onClick={onConfirm}
          className="flex-[2] h-[50px] font-bold !bg-red-700 !border-red-700 text-[16px] hover:!bg-red-500"
        >
          내보내기
        </Button>

        <Button
          variant="secondary"
          size="lg"
          onClick={onClose}
          disabled={isSaving}
          className="flex-1 h-[50px] font-bold !bg-gray-200 !border-gray-200 text-[16px] text-white hover:!bg-gray-300"
        >
          취소
        </Button>
      </div>
    </Modal>
  );
};
