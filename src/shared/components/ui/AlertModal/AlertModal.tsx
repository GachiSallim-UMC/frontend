import { AlertTriangle, CheckCircle } from 'lucide-react';
import { Modal } from '@/shared/components/ui/Modal';
import { Button } from '@/shared/components/ui/Button';
import { useAlertStore } from '@/shared/store';
import type { AlertModalTone } from '@/shared/store';

const TONE_STYLES: Record<AlertModalTone, { icon: typeof AlertTriangle; className: string }> = {
  error: { icon: AlertTriangle, className: 'bg-red-100 text-red-700' },
  success: { icon: CheckCircle, className: 'bg-green-100 text-green-700' },
};

export const AlertModal = () => {
  const { isOpen, title, message, tone, closeAlert } = useAlertStore();
  const { icon: Icon, className } = TONE_STYLES[tone];

  return (
    <Modal isOpen={isOpen} onClose={closeAlert} title={title} dismissible={false}>
      <div className="flex flex-col items-center gap-4 py-2 text-center">
        <span className={`flex h-12 w-12 items-center justify-center rounded-full ${className}`}>
          <Icon className="h-6 w-6" />
        </span>
        <p className="text-sm text-gray-600">{message}</p>
        <Button variant="primary" size="md" className="w-full" onClick={closeAlert}>
          확인
        </Button>
      </div>
    </Modal>
  );
};
