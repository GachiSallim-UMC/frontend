import { Modal } from '@/shared/components';

interface SettlementConfirmProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export const SettlementConfirm = ({
  isOpen,
  onClose,
  onConfirm,
}: SettlementConfirmProps) => {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="전체 정산 완료"
    >
      <div className="flex flex-col gap-4">
        <p className="text-sm text-gray-600">
          모든 멤버의 정산을 완료 처리하시겠어요?
        </p>

        <div className="flex gap-2 mt-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 rounded-lg bg-gray-100 text-gray-700 font-sans text-button font-bold hover:bg-gray-200 transition-colors"
          >
            취소
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            className="flex-1 py-2.5 rounded-lg bg-gray-900 text-white font-sans text-button font-bold hover:bg-black transition-colors"
          >
            전체 정산 완료
          </button>
        </div>
      </div>
    </Modal>
  );
};