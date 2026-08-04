import { Button, Modal } from '@/shared/components';
import BangIcon from '@/assets/icons/member/bang.svg?react';

interface AdminAlertModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const IsAdminModal = ({ isOpen, onClose }: AdminAlertModalProps) => {
  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      dismissible={false}
      className="flex h-[335px] w-[500px] max-w-none flex-col items-center rounded-[20px] overflow-hidden bg-white p-0"
    >
      {/* 상단 아이콘 영역 */}
      <div className="mt-[40px] flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-full bg-red-100">
        <BangIcon className="h-[24px] w-[24px] text-red-700 [&_*]:!fill-current" />
      </div>

      {/* 텍스트 영역 */}
      <div className="mt-[20px] flex flex-col items-center text-center px-6">
        <h1 className="mb-1 text-[24px] font-bold text-gray-900">권한 안내</h1>
        <p className="text-[14px] leading-relaxed text-gray-600">
          그룹 관리자만 수행할 수 있습니다.
        </p>
      </div>

      {/* 버튼 영역 */}
      <div className="mt-auto flex w-full gap-3 border-t border-gray-100 px-[40px] py-[27px]">
        <Button
          variant="primary"
          size="lg"
          onClick={onClose}
          className="flex-1 h-[50px] w-full !bg-red-700 !border-red-700 text-[16px] hover:!bg-red-500"
        >
          확인
        </Button>
      </div>
    </Modal>
  );
};
