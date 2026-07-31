import InfoIcon from '@/assets/icons/chore/bang.svg?react';
import { Button, Modal } from '@/shared/components';

interface ChoreSaveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  choreName: string;
  isSaving?: boolean;
}

export const ChoreSaveModal = ({
  isOpen,
  onClose,
  onConfirm,
  choreName,
  isSaving = false,
}: ChoreSaveModalProps) => {
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
        <div className="mb-5 flex items-center justify-center h-20 w-20 bg-primary-100 rounded-full">
          <InfoIcon className="h-10 w-10 text-primary-600 [&_*]:!fill-current" />
        </div>
        <div className="mb-8 flex flex-col items-center px-2">
          <h1 className="mb-2 text-2xl text-gray-900 font-bold">집안일을 저장하시겠습니까?</h1>
          <p className="text-sm font-medium text-gray-600 leading-relaxed">
            <span className="font-bold text-gray-900">"{choreName}"</span> 내용으로
            <br />
            집안일을 등록/수정합니다.
          </p>
        </div>
      </div>

      {/* 버튼 그룹 */}
      <div className="flex items-center justify-center w-full gap-4 border-t border-gray-100 pt-6">
        <Button
          variant="primary"
          size="lg"
          isLoading={isSaving}
          onClick={onConfirm}
          className="flex-1 !bg-primary-600 !border-primary-600 hover:!bg-primary-700"
        >
          저장
        </Button>

        <Button
          variant="secondary"
          size="lg"
          onClick={onClose}
          disabled={isSaving}
          className="flex-1 !bg-gray-200 !border-gray-200 hover:!bg-gray-400"
        >
          취소
        </Button>
      </div>
    </Modal>
  );
};
