import type { FC } from 'react';
import type { Notification } from '@/features/notification/types';
import { NotificationItem } from '@/features/notification/components/NotificationItem';

interface NotificationListProps {
  notifications: Notification[];
  onHide?: (id: string) => void;
}

export const NotificationList: FC<NotificationListProps> = ({ notifications, onHide }) => {
  return (
    <div className="flex flex-col items-start w-full">
      {notifications.map((notification) => (
        <NotificationItem key={notification.id} {...notification} onHide={onHide} />
      ))}
    </div>
  );
};
