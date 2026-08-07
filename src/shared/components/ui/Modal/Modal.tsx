import type { ReactNode } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/shared/lib/cn';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  className?: string;
  /** false면 헤더의 X 버튼을 숨김 (기본 true) */
  dismissible?: boolean;
  /** 배경 클릭으로 닫을지 여부. 지정하지 않으면 dismissible 값을 따름 */
  closeOnOverlayClick?: boolean;
}

export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  className,
  dismissible = true,
  closeOnOverlayClick,
}: ModalProps) => {
  if (!isOpen) return null;

  const overlayClosable = closeOnOverlayClick ?? dismissible;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={overlayClosable ? onClose : undefined}
    >
      <div
        className={cn(
          // 내용이 화면보다 길어질 수 있는 모바일에서 위/아래가 잘리지 않도록, 넘치면 모달 자체가 스크롤되게 한다
          'flex max-h-[calc(100dvh-2rem)] w-full max-w-md flex-col overflow-y-auto rounded-[20px] bg-white p-6 shadow-dropdown',
          className,
        )}
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
