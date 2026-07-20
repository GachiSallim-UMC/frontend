import type { ReactNode } from 'react';
import { cn } from '@/shared/lib/cn';
import { Button } from '../Button/Button';
import { ShareMessengerButton } from '../Button/ShareMessengerButton';

interface FormActionsProps {
  onSave: () => void;
  onCancel: () => void;
  saveLabel?: string;
  cancelLabel?: string;
  rightSlot?: ReactNode;
  className?: string;
}

/** 폼 하단 저장/취소(+메신저 공유) 버튼 줄 — 여러 화면에서 각자 손으로 만들다 onClick을 빠뜨리는 실수가 있어 공용화 */
export const FormActions = ({
  onSave,
  onCancel,
  saveLabel = '저장',
  cancelLabel = '취소',
  rightSlot = <ShareMessengerButton />,
  className,
}: FormActionsProps) => (
  <div className={cn('flex items-center justify-between', className)}>
    <div className="flex gap-3">
      <Button type="button" className="w-[150px] font-bold" onClick={onSave}>
        {saveLabel}
      </Button>
      <Button
        type="button"
        variant="secondary"
        className="w-[150px] font-normal"
        onClick={onCancel}
      >
        {cancelLabel}
      </Button>
    </div>
    <div className="w-[189px] min-w-0 shrink">{rightSlot}</div>
  </div>
);
