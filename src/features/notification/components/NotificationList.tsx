import type { FC } from 'react';
import type { Notification } from '@/features/notification/types';
import { NotificationItem } from '@/features/notification/components/NotificationItem';

interface NotificationListProps {
  notifications: Notification[];
}

export const NotificationList: FC<NotificationListProps> = ({ notifications }) => {
  return (
    <div className="flex flex-col items-start w-full">
      {notifications.map((notification) => (
        <NotificationItem key={notification.id} {...notification} />
      ))}
    </div>
  );
};
