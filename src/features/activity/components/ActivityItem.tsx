import type { FC } from 'react';
import type { ActivityLog } from '@/features/activity/types';
import { cn } from '@/shared/lib/cn';

interface ActivityItemProps extends Pick<ActivityLog, 'actorName' | 'description' | 'time'> {
  isFirst?: boolean;
  isLast?: boolean;
}

export const ActivityItem: FC<ActivityItemProps> = ({ actorName, description, time, isFirst, isLast }) => {
  return (
    <div
      className={cn(
        'flex min-h-[69px] w-full flex-col justify-center gap-[5px] border-t border-gray-100 bg-white px-[29px]',
        isFirst && 'border-t-0',
        isLast && 'border-b',
      )}
    >
      <p className="text-caption text-gray-900">
        <span className="font-bold">{actorName}</span> {description}
      </p>
      <p className="text-xs text-gray-400">{time}</p>
    </div>
  );
};
