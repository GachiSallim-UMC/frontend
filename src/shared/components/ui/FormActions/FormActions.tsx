import type { ReactNode } from 'react';
import { cn } from '@/shared/lib/cn';
import { Button } from '../Button/Button';
import { ShareMessengerButton } from '../Button/ShareMessengerButton';

interface FormActionsProps {
  onSave: () => void;
  onCancel: () => void;
  onDelete?: () => void;
  saveLabel?: string;
  cancelLabel?: string;
  deleteLabel?: string;
  isSubmitting?: boolean;
  /** 우측 슬롯 — 기본은 메신저 공유 버튼, null이면 아예 렌더링하지 않음 */
  rightSlot?: ReactNode;
  className?: string;
}

/** 폼 하단 저장/취소(+메신저 공유) 버튼 줄 — 여러 화면에서 각자 손으로 만들다 onClick을 빠뜨리는 실수가 있어 공용화 */
export const FormActions = ({
  onSave,
  onCancel,
  onDelete,
  saveLabel = '저장',
  cancelLabel = '취소',
  deleteLabel = '삭제',
  isSubmitting = false,
  rightSlot = <ShareMessengerButton />,
  className,
}: FormActionsProps) => (
  <div className={cn('flex items-center justify-between', className)}>
    <div className="flex gap-3">
      <Button
        type="button"
        className="w-[150px] font-bold"
        onClick={onSave}
        disabled={isSubmitting}
      >
        {saveLabel}
      </Button>
      <Button
        type="button"
        variant="secondary"
        className="w-[150px] font-normal"
        onClick={onCancel}
        disabled={isSubmitting}
      >
        {cancelLabel}
      </Button>
      {onDelete && (
        <Button
          type="button"
          className="w-[150px] border-0 bg-red-700 font-bold text-white hover:bg-red-500"
          onClick={onDelete}
          disabled={isSubmitting}
        >
          {deleteLabel}
        </Button>
      )}
    </div>
    {rightSlot && <div className="w-[189px] min-w-0 shrink">{rightSlot}</div>}
  </div>
);
