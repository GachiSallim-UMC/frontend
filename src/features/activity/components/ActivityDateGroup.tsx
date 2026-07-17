import type { FC } from 'react';
import type { ActivityLog } from '@/features/activity/types';
import { ActivityItem } from '@/features/activity/components/ActivityItem';

interface ActivityDateGroupProps {
  dateLabel: string;
  logs: ActivityLog[];
}

export const ActivityDateGroup: FC<ActivityDateGroupProps> = ({ dateLabel, logs }) => {
  return (
    <div className="w-full">
      <div className="flex h-[38px] w-full items-center bg-primary-200 px-6">
        <p className="text-caption font-bold text-primary-600">{dateLabel}</p>
      </div>
      <div className="w-full border-x border-gray-100">
        {logs.map((log, index) => (
          <ActivityItem
            key={log.id}
            actorName={log.actorName}
            description={log.description}
            time={log.time}
            isFirst={index === 0}
            isLast={index === logs.length - 1}
          />
        ))}
      </div>
    </div>
  );
};
