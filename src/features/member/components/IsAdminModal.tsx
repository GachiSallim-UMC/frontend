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
      className="w-full max-w-[500px] overflow-hidden rounded-[28px] p-0"
    >
      {/* 상단 아이콘 영역 */}
      <div className="flex flex-col items-center px-6 pb-8 pt-10 text-center">
        <span className="flex size-[72px] items-center justify-center rounded-full bg-red-100">
          <BangIcon className="size-6 text-red-700 [&_*]:!fill-current" />
        </span>

        {/* 텍스트 영역 */}
        <h2 className="mt-5 text-[20px] font-bold leading-normal text-gray-900">권한 안내</h2>
        <p className="mt-1 text-[13px] leading-[1.5] text-gray-600">
          그룹 관리자만 수행할 수 있습니다.
        </p>
      </div>

      {/* 버튼 영역 */}
      <div className="flex items-center border-t border-gray-100 px-6 py-[27px] lg:px-10">
        <Button
          variant="primary"
          size="lg"
          onClick={onClose}
          className="h-[58px] w-full rounded-lg bg-red-700 font-bold text-white transition-colors hover:bg-red-500"
        >
          확인
        </Button>
      </div>
    </Modal>
  );
};
