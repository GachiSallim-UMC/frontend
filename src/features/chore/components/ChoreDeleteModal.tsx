import BangIcon from '@/assets/icons/action/trash.svg?react';
import { Button, Modal } from '@/shared/components';

interface ChoreDeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  choreName: string;
  isDeleting?: boolean;
}

export const ChoreDeleteModal = ({
  isOpen,
  onClose,
  onConfirm,
  choreName,
  isDeleting = false,
}: ChoreDeleteModalProps) => {
  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      dismissible={false}
      className="w-[500px] max-w-none flex-col rounded-3xl px-8 pb-7 pt-10"
    >
      {/* 상단 아이콘 및 타이틀 */}
      <div className="flex flex-col items-center text-center">
        <div className="mb-5 flex items-center justify-center h-20 w-20 bg-red-100 rounded-full">
          <BangIcon className="h-10 w-10 text-red-500" />
        </div>
        <div className="mb-8 flex flex-col items-center px-2">
          <h1 className="mb-2 text-2xl text-gray-900 font-bold">집안일을 삭제하시겠습니까?</h1>
          <p className="text-sm font-medium text-gray-600 leading-relaxed">
            <span className="font-bold text-gray-900">"{choreName}"</span>의 내용과 기록이 모두
            사라지며,
            <br />
            삭제된 데이터는 복구할 수 없습니다.
          </p>
        </div>
      </div>

      {/* 버튼 그룹 */}
      <div className="flex items-center justify-center w-full gap-4 border-t border-gray-100 pt-6">
        <Button
          variant="primary"
          size="lg"
          isLoading={isDeleting}
          onClick={onConfirm}
          className="flex-1 !bg-red-700 !border-red-700 hover:!bg-red-500"
        >
          삭제
        </Button>

        <Button
          variant="secondary"
          size="lg"
          onClick={onClose}
          disabled={isDeleting}
          className="flex-1 !bg-gray-200 !border-gray-200 hover:!bg-gray-400"
        >
          취소
        </Button>
      </div>
    </Modal>
  );
};
