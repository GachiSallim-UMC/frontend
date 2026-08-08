import { AlertTriangle, CheckCircle } from 'lucide-react';
import { Modal } from '@/shared/components/ui/Modal';
import { cn } from '@/shared/lib/cn';
import { useAlertStore } from '@/shared/store';
import type { AlertModalTone } from '@/shared/store';

const TONE_STYLES: Record<
  AlertModalTone,
  { icon: typeof AlertTriangle; iconBg: string; iconColor: string; confirm: string }
> = {
  error: {
    icon: AlertTriangle,
    iconBg: 'bg-red-100',
    iconColor: 'text-red-700',
    confirm: 'bg-red-700 hover:bg-red-500',
  },
  success: {
    icon: CheckCircle,
    iconBg: 'bg-green-100',
    iconColor: 'text-green-700',
    confirm: 'bg-green-700 hover:bg-green-500',
  },
};

/** ConfirmModal과 동일한 레이아웃(아이콘·제목·설명)을 쓰는 단순 안내용 공용 모달. */
export const AlertModal = () => {
  const { isOpen, title, message, tone, closeAlert } = useAlertStore();
  const styles = TONE_STYLES[tone];
  const Icon = styles.icon;

  return (
    <Modal
      isOpen={isOpen}
      onClose={closeAlert}
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
            <Icon className="h-full w-full" />
          </span>
        </span>

        <h2 className="mt-[16px] text-[18px] lg:mt-5 lg:text-[20px] font-bold leading-tight lg:leading-normal text-gray-900">
          {title}
        </h2>
        <p className="mt-[2px] text-[13px] leading-tight lg:mt-1 lg:leading-[1.5] text-gray-600">
          {message}
        </p>
      </div>

      <div className="mt-auto shrink-0 flex items-center border-t-0 lg:border-t lg:border-gray-100 px-4 pb-[16px] lg:py-[27px] lg:px-10">
        <button
          type="button"
          onClick={closeAlert}
          className={cn(
            'h-[44px] w-full lg:h-[58px] rounded-lg text-[14px] lg:text-button font-bold text-white transition-colors',
            styles.confirm,
          )}
        >
          확인
        </button>
      </div>
    </Modal>
  );
};
