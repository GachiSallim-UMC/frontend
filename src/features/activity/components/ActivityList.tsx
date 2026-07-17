import type { FC } from 'react';
import type { ActivityLogGroup } from '@/features/activity/types';
import { ActivityDateGroup } from '@/features/activity/components/ActivityDateGroup';

interface ActivityListProps {
  groups: ActivityLogGroup[];
}

export const ActivityList: FC<ActivityListProps> = ({ groups }) => {
  if (groups.length === 0) {
    return (
      <div className="flex h-full w-full items-center justify-center text-caption text-gray-500">
        해당 조건에 맞는 활동 내역이 없습니다.
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col">
      {groups.map(group => (
        <ActivityDateGroup key={group.date} dateLabel={group.dateLabel} logs={group.logs} />
      ))}
    </div>
  );
};
