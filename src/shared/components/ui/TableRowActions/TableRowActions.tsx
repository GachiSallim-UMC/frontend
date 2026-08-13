import { Link } from 'react-router-dom';
import EditIcon from '@/assets/icons/action/edit.svg?react';
import ShareIcon from '@/assets/icons/action/share.svg?react';
import { cn } from '@/shared/lib';

interface TableRowActionsProps {
  onEdit?: () => void;
  editTo?: string;
  onShare?: () => void;
  editLabel?: string;
  shareLabel?: string;
  className?: string;
  actionClassName?: string;
  iconClassName?: string;
}

export const TableRowActions = ({
  onEdit,
  editTo,
  onShare,
  editLabel = '수정',
  shareLabel = '공유',
  className,
  actionClassName,
  iconClassName = 'h-[39px] w-[39px]',
}: TableRowActionsProps) => {
  const actionClasses = cn(
    'flex items-center justify-center transition-colors hover:text-gray-500',
    actionClassName,
  );

  return (
    <span className={cn('flex justify-end text-gray-500', className)}>
      {editTo ? (
        <Link to={editTo} aria-label={editLabel} className={actionClasses}>
          <EditIcon className={iconClassName} />
        </Link>
      ) : onEdit ? (
        <button type="button" onClick={onEdit} aria-label={editLabel} className={actionClasses}>
          <EditIcon className={iconClassName} />
        </button>
      ) : null}

      {onShare ? (
        <button type="button" onClick={onShare} aria-label={shareLabel} className={actionClasses}>
          <ShareIcon className={iconClassName} />
        </button>
      ) : null}
    </span>
  );
};
