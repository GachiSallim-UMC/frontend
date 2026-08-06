import type { FC } from 'react';
import type { ActivityLog } from '@/features/activity/types';
import { ActivityItem } from '@/features/activity/components/ActivityItem';

interface ActivityDateGroupProps {
  dateLabel: string;
  logs: ActivityLog[];
}

export const ActivityDateGroup: FC<ActivityDateGroupProps> = ({ dateLabel, logs }) => {
  return (
    <div className="mb-4 w-full overflow-hidden rounded-lg border border-gray-100 last:mb-0 lg:mb-0 lg:overflow-visible lg:rounded-none lg:border-0">
      <div className="flex h-[38px] w-full items-center bg-primary-200 px-4 lg:px-6">
        <p className="text-caption font-bold text-primary-600">{dateLabel}</p>
      </div>
      <div className="w-full lg:border-x lg:border-gray-100">
        {logs.map((log, index) => (
          <ActivityItem
            key={log.id}
            description={log.description}
            createdAt={log.createdAt}
            route={log.route}
            isLast={index === logs.length - 1}
          />
        ))}
      </div>
    </div>
  );
};
