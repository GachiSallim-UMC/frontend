import EditIcon from '@/assets/icons/action/edit.svg?react';
import ShareIcon from '@/assets/icons/action/share.svg?react';
import { cn } from '@/shared/lib';

interface TableRowActionsProps {
  onEdit?: () => void;
  onShare?: () => void;
  className?: string;
  iconClassName?: string;
}

export const TableRowActions = ({
  onEdit,
  onShare,
  className,
  iconClassName = 'h-[39px] w-[39px]',
}: TableRowActionsProps) => (
  <span className={cn('flex justify-end text-gray-500', className)}>
    <button type="button" onClick={onEdit} aria-label="수정">
      <EditIcon className={iconClassName} />
    </button>
    <button type="button" onClick={onShare} aria-label="공유">
      <ShareIcon className={iconClassName} />
    </button>
  </span>
);
