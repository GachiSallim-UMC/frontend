import { useQuery } from '@tanstack/react-query';
import { notificationApi } from '@/features/notification/api/notification.api';
import { NOTIFICATION_QUERY_KEYS } from './useNotifications';

/** 헤더 알림 배지 등 안 읽은 알림 개수가 필요한 곳에서 사용 */
export const useUnreadNotificationCount = () => {
  const { data = 0, ...query } = useQuery({
    queryKey: NOTIFICATION_QUERY_KEYS.unreadCount(),
    queryFn: notificationApi.getUnreadCount,
  });

  return { unreadCount: data, ...query };
};
