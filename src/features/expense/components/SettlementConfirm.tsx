import { Modal } from '@/shared/components';

interface SettlementConfirmProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title?: string;
  description?: string;
  confirmLabel?: string;
  isPending?: boolean;
}

export const SettlementConfirm = ({
  isOpen,
  onClose,
  onConfirm,
  title = '전체 정산 완료',
  description = '모든 멤버의 정산을 완료 처리하시겠어요?',
  confirmLabel = '전체 정산 완료',
  isPending = false,
}: SettlementConfirmProps) => {
  const handleConfirm = async () => {
    try {
      await onConfirm();
      onClose();
    } catch {
      // 호출 화면에서 오류를 안내하며, 재시도할 수 있도록 모달을 유지합니다.
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
    >
      <div className="flex flex-col gap-4">
        <p className="text-sm text-gray-600">
          {description}
        </p>

        <div className="flex gap-2 mt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isPending}
            className="flex-1 py-2.5 rounded-lg bg-gray-100 text-gray-700 font-sans text-button font-bold hover:bg-gray-200 transition-colors"
          >
            취소
          </button>

          <button
            type="button"
            onClick={() => void handleConfirm()}
            disabled={isPending}
            className="flex-1 py-2.5 rounded-lg bg-gray-900 text-white font-sans text-button font-bold hover:bg-black transition-colors disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending ? '처리 중...' : confirmLabel}
          </button>
        </div>
      </div>
    </Modal>
  );
};
