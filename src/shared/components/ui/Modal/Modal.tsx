import type { ReactNode } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/shared/lib/cn';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  className?: string;
  /** false면 배경 클릭/X 버튼으로 닫히지 않음 (기본 true) */
  dismissible?: boolean;
}

export const Modal = ({ isOpen, onClose, title, children, className, dismissible = true }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={dismissible ? onClose : undefined}
    >
      <div
        className={cn('w-full max-w-md rounded-[20px] bg-white p-6 shadow-dropdown', className)}
        onClick={e => e.stopPropagation()}
      >
        {(title || dismissible) && (
          <div className="mb-4 flex items-center justify-between">
            {title && <h3 className="text-[18px] font-bold leading-[normal] text-gray-900">{title}</h3>}
            {dismissible && (
              <button
                type="button"
                onClick={onClose}
                aria-label="닫기"
                className="text-gray-400 transition-colors hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
        )}
        {children}
      </div>
    </div>
  );
};
