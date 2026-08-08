import { Button } from '@/shared/components';
import MessengerIcon from '@/assets/icons/sidebar/messenger.svg?react';

interface ChoreFormActionsProps {
  onSave: () => void;
  onCancel: () => void;
  onDelete?: () => void;
  onShare?: () => void;
  isSubmitting?: boolean;
}

export const ChoreFormActions = ({
  onSave,
  onCancel,
  onDelete,
  onShare,
  isSubmitting,
}: ChoreFormActionsProps) => {
  return (
    <div className="flex w-full flex-col gap-[10px] lg:flex-row lg:items-center lg:justify-between lg:gap-0">
      <div className="order-2 flex w-full flex-col lg:order-1 lg:flex-row lg:items-center lg:w-auto gap-[10px] lg:gap-[12px]">
        <Button
          className="h-[44px] w-full text-[14px] font-bold lg:h-[50px] lg:w-[150px] lg:flex-none lg:text-[16px]"
          onClick={onSave}
          disabled={isSubmitting}
        >
          저장
        </Button>
        <Button
          variant="secondary"
          className="hidden lg:flex font-bold lg:h-[50px] lg:w-[150px] lg:text-[16px]"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          취소
        </Button>
        {onDelete && (
          <Button
            variant="secondary"
            className="h-[44px] w-full text-[14px] font-bold lg:h-[50px] lg:w-[150px] lg:flex-none lg:text-[16px] bg-red-700 text-white hover:bg-red-700 border-none"
            onClick={onDelete}
            disabled={isSubmitting}
          >
            삭제
          </Button>
        )}
      </div>
      {onShare && (
        <Button
          variant="ghost"
          onClick={onShare}
          leftIcon={
            <MessengerIcon className="h-[20px] w-[20px] lg:h-[24px] lg:w-[24px] text-primary-600" />
          }
          className="order-1 lg:order-2 h-[44px] w-full lg:h-[50px] lg:w-[200px] text-[14px] lg:text-[16px] lg:py-[13px] lg:pl-[34px] lg:pr-[35px] font-normal bg-white border border-dashed border-primary-500 text-primary-600 hover:bg-primary-50"
        >
          메신저에 공유
        </Button>
      )}
    </div>
  );
};
