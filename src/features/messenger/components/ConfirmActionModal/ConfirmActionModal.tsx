import type { ReactNode } from 'react';
import { Modal } from '@/shared/components/ui/Modal';
import { cn } from '@/shared/lib/cn';

interface ConfirmActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** 72x72 크기의 완성된 아이콘(원형 배경 포함 여부는 호출부에서 결정) */
  icon: ReactNode;
  title: string;
  description: ReactNode;
  children?: ReactNode;
  /** children 아래 여백 (모달마다 콘텐츠 높이가 달라 Figma 기준으로 개별 지정) */
  contentBottomClassName?: string;
  primaryLabel: string;
  onPrimary: () => void;
  primaryDisabled?: boolean;
  primaryVariant?: 'danger' | 'primary';
  cancelLabel?: string;
}

export const ConfirmActionModal = ({
  isOpen,
  onClose,
  icon,
  title,
  description,
  children,
  contentBottomClassName = 'pb-16',
  primaryLabel,
  onPrimary,
  primaryDisabled = false,
  primaryVariant = 'primary',
  cancelLabel = '취소',
}: ConfirmActionModalProps) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      dismissible={false}
      closeOnOverlayClick
      className="max-w-[500px] rounded-[28px] p-0"
    >
      <div className={cn('flex flex-col items-center gap-2 px-6 pt-10 text-center', !children && 'pb-10')}>
        <div className="mb-2 flex h-[72px] w-[72px] shrink-0 items-center justify-center">{icon}</div>
        <h3 className="text-[24px] font-bold leading-[normal] text-gray-900">{title}</h3>
        <div className="text-[14px] font-medium leading-[normal] text-gray-600">{description}</div>
      </div>

      {children && <div className={cn('px-10 pt-6', contentBottomClassName)}>{children}</div>}

      <div className="flex items-center gap-5 border-t border-gray-100 px-10 py-[26px]">
        <button
          type="button"
          onClick={onPrimary}
          disabled={primaryDisabled}
          className={cn(
            'h-[58px] flex-1 rounded-lg text-[16px] font-bold leading-[normal] text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50',
            primaryVariant === 'danger' ? 'bg-red-700 hover:bg-red-700/90' : 'bg-primary-600 hover:bg-primary-700',
          )}
        >
          {primaryLabel}
        </button>
        <button
          type="button"
          onClick={onClose}
          className="h-[58px] w-[140px] shrink-0 rounded-lg bg-gray-200 text-[16px] font-bold leading-[normal] text-white transition-colors hover:bg-gray-200/80"
        >
          {cancelLabel}
        </button>
      </div>
    </Modal>
  );
};
