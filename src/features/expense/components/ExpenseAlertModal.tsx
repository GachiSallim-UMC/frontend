// AlertModal.tsx
import type { ReactNode } from 'react';
import { Modal } from '@/shared/components/ui/Modal';
import { cn } from '@/shared/lib/cn';

type AlertTone = 'default' | 'danger' | 'warning';

interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** 도메인 대표 아이콘 (경고·에러·정보) */
  icon: ReactNode;
  /** 예: "이미지를 등록할 수 없습니다" */
  title: string;
  /** 강조할 대상 이름 (선택) */
  highlight?: string;
  /** 강조 대상 뒤에 이어질 설명 */
  description: ReactNode;
  confirmLabel?: string;
  /** danger: 실패/에러, warning: 주의, default: 단순 안내 */
  tone?: AlertTone;
}

const toneStyles: Record<AlertTone, { iconBg: string; iconColor: string; confirm: string }> = {
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
  warning: {
    iconBg: 'bg-orange-100',
    iconColor: 'text-orange-700',
    confirm: 'bg-orange-700 hover:bg-orange-500',
  },
};

/**
 * 단순 알림(에러·경고·안내) 공용 모달. 확인 버튼 하나로만 닫히며,
 * 액션을 실행/취소하는 흐름에는 ConfirmModal을 사용합니다.
 * Figma "공통 모달" 시리즈 기준, ConfirmModal과 동일 레이아웃에서 취소 버튼만 제거.
 *
 */
export const AlertModal = ({
  isOpen,
  onClose,
  icon,
  title,
  highlight,
  description,
  confirmLabel = '확인',
  tone = 'default',
}: AlertModalProps) => {
  const styles = toneStyles[tone];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      dismissible={false}
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
      </div>

      <div className="mt-auto shrink-0 flex items-center gap-[16px] border-t-0 lg:border-t lg:border-gray-100 px-4 pb-[16px] lg:py-[27px] lg:gap-5 lg:px-10">
        <button
          type="button"
          onClick={onClose}
          className={cn(
            'h-[44px] w-full lg:h-[58px] rounded-lg text-[14px] lg:text-button font-bold text-white transition-colors',
            styles.confirm,
          )}
        >
          {confirmLabel}
        </button>
      </div>
    </Modal>
  );
};