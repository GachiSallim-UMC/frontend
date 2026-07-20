import type { FC } from 'react';
import type { ActivityLog } from '@/features/activity/types';
import { cn } from '@/shared/lib/cn';

type ActivityItemProps = Pick<ActivityLog, 'actorName' | 'description' | 'time'>;

export const ActivityItem: FC<ActivityItemProps> = ({ actorName, description, time }) => {
  return (
    <div
      className={cn(
        'flex min-h-[69px] w-full flex-col justify-center gap-[5px] border-t border-gray-100 bg-white px-[29px]',
        'first:border-t-0 last:border-b',
      )}
    >
      <p className="text-caption text-gray-900">
        <span className="font-bold">{actorName}</span> {description}
      </p>
      <p className="text-xs text-gray-400">{time}</p>
    </div>
  );
};
