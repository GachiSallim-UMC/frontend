import { AlertTriangle } from 'lucide-react';
import { Modal } from '@/shared/components/ui/Modal';
import { Button } from '@/shared/components/ui/Button';
import { useErrorStore } from '@/shared/store';

export const ErrorModal = () => {
  const { isOpen, title, message, closeError } = useErrorStore();

  return (
    <Modal isOpen={isOpen} onClose={closeError} title={title} dismissible={false}>
      <div className="flex flex-col items-center gap-4 py-2 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-700">
          <AlertTriangle className="h-6 w-6" />
        </span>
        <p className="text-sm text-gray-600">{message}</p>
        <Button variant="primary" size="md" className="w-full" onClick={closeError}>
          확인
        </Button>
      </div>
    </Modal>
  );
};
