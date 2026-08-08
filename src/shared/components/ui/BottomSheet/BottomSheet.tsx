import type { ReactNode } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/shared/lib/cn';

interface BottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  className?: string;
  /** false면 헤더의 X 버튼을 숨김 (기본 true, title이 있을 때만 헤더가 렌더링됨) */
  dismissible?: boolean;
  /** 배경 클릭으로 닫을지 여부. 지정하지 않으면 dismissible 값을 따름 */
  closeOnOverlayClick?: boolean;
}

/** 모바일 전용 하단 시트. 데스크톱 다이얼로그는 Modal을 사용합니다. */
export const BottomSheet = ({
  isOpen,
  onClose,
  title,
  children,
  className,
  dismissible = true,
  closeOnOverlayClick,
}: BottomSheetProps) => {
  if (!isOpen) return null;

  const overlayClosable = closeOnOverlayClick ?? dismissible;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end bg-gray-900/60"
      onClick={overlayClosable ? onClose : undefined}
    >
      <div
        className={cn(
          'flex w-full flex-col rounded-t-xl bg-white pb-[calc(20px+env(safe-area-inset-bottom))]',
          className,
        )}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex justify-center pb-1 pt-2">
          <span className="h-1 w-[68px] rounded-full bg-gray-200" />
        </div>

        {title && (
          <div className="relative flex items-center justify-center px-4 py-3">
            <h2 className="text-mobile-title font-bold text-gray-900">{title}</h2>
            {dismissible && (
              <button
                type="button"
                onClick={onClose}
                aria-label="닫기"
                className="absolute right-4 text-gray-400 transition-colors hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            )}
          </div>
        )}

        {children}
      </div>
    </div>
  );
};
