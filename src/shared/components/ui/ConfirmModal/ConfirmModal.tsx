import type { ReactNode } from 'react';
import { Modal } from '@/shared/components/ui/Modal';
import { cn } from '@/shared/lib/cn';

type ConfirmTone = 'default' | 'danger' | 'edit';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  /** 도메인 대표 아이콘 (집안일·생활비·공용물품·생활규칙) */
  icon: ReactNode;
  /** 예: "집안일을 등록할까요?" */
  title: string;
  /** 굵게 강조할 대상 이름. 예: 집안일 이름 */
  highlight?: string;
  /** 강조 대상 뒤에 이어질 설명. 예: 내용으로 집안일을 등록합니다. */
  description: ReactNode;
  confirmLabel?: string;
  cancelLabel?: string;
  isPending?: boolean;
  /**
   * 확인 동작이 실패했을 때 보여줄 메시지.
   * 모달이 열린 채로 실패하면 페이지 본문의 오류 문구가 모달에 가리므로
   * 여기에 전달해 모달 안에서 보여줍니다.
   */
  errorMessage?: string;
  /** danger는 삭제 등 파괴적 동작 (Figma: Delete 모달) */
  tone?: ConfirmTone;
  /** 취소 확인처럼 비파괴적인 모달에서만 배경 클릭 닫기를 허용합니다. */
  closeOnOverlayClick?: boolean;
}

const toneStyles: Record<ConfirmTone, { iconBg: string; iconColor: string; confirm: string }> = {
  default: {
    iconBg: 'bg-primary-200',
    iconColor: 'text-primary-700',
    confirm: 'bg-primary-700 hover:bg-primary-600',
  },
  danger: {
    iconBg: 'bg-red-100',
    iconColor: 'text-red-700',
    confirm: 'bg-red-700 hover:bg-red-500',
  },
  edit: {
    iconBg: 'bg-orange-100',
    iconColor: 'text-orange-700',
    confirm: 'bg-orange-700 hover:bg-orange-500',
  },
};

/**
 * 생성·수정·삭제 확인 공용 모달.
 * Figma "공통 모달 C(R)UD 모달" 기준이며, 동작 완료 후 알림 모달에는 사용하지 않습니다.
 */
export const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  icon,
  title,
  highlight,
  description,
  confirmLabel = '저장하기',
  cancelLabel = '취소',
  isPending = false,
  errorMessage,
  tone = 'default',
  closeOnOverlayClick = false,
}: ConfirmModalProps) => {
  const styles = toneStyles[tone];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      dismissible={false}
      closeOnOverlayClick={closeOnOverlayClick && !isPending}
      className="w-[357px] max-w-[calc(100vw-32px)] min-h-[202px] flex flex-col overflow-hidden rounded-[20px] p-0
      lg:block lg:h-auto lg:w-full lg:max-w-[500px] lg:rounded-[28px]"
    >
      <div className="shrink-0 flex flex-col items-center px-4 pt-[20px] lg:px-6 lg:pb-8 lg:pt-10 text-center">
        <span
          className={cn(
            'flex size-[48px] lg:size-[72px] items-center justify-center rounded-full',
            styles.iconBg,
          )}
        >
          <span className={cn('flex size-6 items-center justify-center', styles.iconColor)}>
            {icon}
          </span>
        </span>

        <h2 className="mt-[16px] text-[18px] lg:mt-5 lg:text-[20px] font-bold leading-tight lg:leading-normal text-gray-900">
          {title}
        </h2>
        <p className="mt-[2px] text-[13px] leading-tight lg:mt-1 lg:leading-[1.5] text-gray-600">
          {highlight && <span className="font-bold text-gray-800">“{highlight}”</span>}
          {highlight && ' '}
          {description}
        </p>

        {errorMessage && (
          <p role="alert" className="mt-2 lg:mt-4 text-[13px] leading-[1.5] text-red-700">
            {errorMessage}
          </p>
        )}
      </div>

      <div className="mt-auto shrink-0 flex items-center gap-[16px] border-t-0 lg:border-t lg:border-gray-100 px-4 pb-[16px] lg:py-[27px] lg:gap-5 lg:px-10">
        <button
          type="button"
          onClick={onConfirm}
          disabled={isPending}
          className={cn(
            'h-[44px] flex-1 lg:h-[58px] lg:flex-[26] rounded-lg text-[14px] lg:text-button font-bold text-white transition-colors',
            'disabled:cursor-not-allowed disabled:opacity-50',
            styles.confirm,
          )}
        >
          {confirmLabel}
        </button>
        <button
          type="button"
          onClick={onClose}
          disabled={isPending}
          className={cn(
            'h-[44px] flex-1 lg:h-[58px] lg:flex-[14] rounded-lg bg-gray-200 text-[14px] lg:text-button font-bold text-white transition-colors',
            'hover:bg-gray-400 disabled:cursor-not-allowed disabled:opacity-50',
          )}
        >
          {cancelLabel}
        </button>
      </div>
    </Modal>
  );
};
