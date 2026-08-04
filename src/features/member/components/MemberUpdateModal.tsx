import SettingIcon from '@/assets/icons/sidebar/group-settings.svg?react';
import { Button, Modal } from '@/shared/components';

interface MemberUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isSaving?: boolean;
}

export const MemberUpdateModal = ({
  isOpen,
  onClose,
  onConfirm,
  isSaving = false,
}: MemberUpdateModalProps) => {
  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      dismissible={false}
      className="flex h-[335px] w-[500px] max-w-none flex-col items-center rounded-[20px] p-0 overflow-hidden bg-white"
    >
      {/* 상단 아이콘 영역 */}
      <div className="mt-[40px] flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-full bg-orange-100">
        <SettingIcon className="h-[24px] w-[24px] text-orange-700 [&_*]:!fill-current" />
      </div>

      {/* 텍스트 영역 */}
      <div className="mt-[20px] flex flex-col items-center text-center px-6">
        <h1 className="mb-1 text-[24px] font-bold text-gray-900">그룹 설정을 수정할까요?</h1>
        <p className="text-[14px] leading-relaxed text-gray-600">
          입력하신 내용으로 그룹 데이터를 수정합니다.
        </p>
      </div>

      {/* 버튼 영역*/}
      <div className="mt-auto flex w-full gap-3 border-t border-gray-100 px-[40px] py-[27px]">
        <Button
          variant="primary"
          size="lg"
          isLoading={isSaving}
          onClick={onConfirm}
          className="flex-[2] h-[50px] !bg-orange-700 !border-orange-700 text-[16px] hover:!bg-orange-500"
        >
          수정
        </Button>

        <Button
          variant="secondary"
          size="lg"
          onClick={onClose}
          disabled={isSaving}
          className="flex-1 h-[50px] !bg-gray-200 !border-gray-200 text-[16px] text-white hover:!bg-gray-300"
        >
          취소
        </Button>
      </div>
    </Modal>
  );
};
