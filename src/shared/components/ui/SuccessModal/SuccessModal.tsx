import { CheckCircle2 } from 'lucide-react';
import { Modal } from '@/shared/components/ui/Modal';
import { Button } from '@/shared/components/ui/Button';
import { useSuccessStore } from '@/shared/store';

export const SuccessModal = () => {
  const { isOpen, title, message, closeSuccess } = useSuccessStore();

  return (
    <Modal isOpen={isOpen} onClose={closeSuccess} title={title} dismissible={false}>
      <div className="flex flex-col items-center gap-4 py-2 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-green-700">
          <CheckCircle2 className="h-6 w-6" />
        </span>
        <p className="text-sm text-gray-600">{message}</p>
        <Button variant="primary" size="md" className="w-full" onClick={closeSuccess}>
          확인
        </Button>
      </div>
    </Modal>
  );
};
