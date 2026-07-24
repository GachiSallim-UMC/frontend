import type { FC } from 'react';
import type { ActivityLog } from '@/features/activity/types';
import { toTimeLabel } from '@/features/activity/lib/activityDate';
import { cn } from '@/shared/lib/cn';

type ActivityItemProps = Pick<ActivityLog, 'description' | 'createdAt'>;

export const ActivityItem: FC<ActivityItemProps> = ({ description, createdAt }) => {
  return (
    <div
      className={cn(
        'flex min-h-[69px] w-full flex-col justify-center gap-[5px] border-t border-gray-100 bg-white px-[29px]',
        'first:border-t-0 last:border-b',
      )}
    >
      <p className="text-caption text-gray-900">{description ?? '새로운 활동이 있습니다.'}</p>
      <p className="text-xs text-gray-400">{toTimeLabel(createdAt)}</p>
    </div>
  );
};
