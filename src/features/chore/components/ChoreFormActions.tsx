import { Button } from '@/shared/components';
import MessengerIcon from '@/assets/icons/sidebar/messenger.svg?react';

interface ChoreFormActionsProps {
  onSave: () => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export const ChoreFormActions = ({ onSave, onCancel, isSubmitting }: ChoreFormActionsProps) => {
  return (
    <div className="flex w-full items-center justify-between">
      <div className="flex items-center gap-[12px]">
        <Button className="w-[150px] font-bold" onClick={onSave} disabled={isSubmitting}>
          저장
        </Button>
        <Button
          variant="secondary"
          className="w-[150px] font-bold"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          취소
        </Button>
      </div>
      <Button
        variant="ghost"
        leftIcon={<MessengerIcon className="h-[24px] w-[24px] text-primary-600" />}
        className="py-[13px] pl-[34px] pr-[35px] font-normal bg-white border border-dashed border-primary-500 text-primary-600 hover:bg-primary-50"
      >
        메신저에 공유
      </Button>
    </div>
  );
};
