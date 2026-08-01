import { useQuery } from '@tanstack/react-query';
import { notificationApi } from '@/features/notification/api/notification.api';
import { REALTIME_POLL_INTERVAL_MS } from '@/shared/lib';
import { NOTIFICATION_QUERY_KEYS } from './useNotifications';

/** 헤더 알림 배지 등 안 읽은 알림 개수가 필요한 곳에서 사용. 다른 사용자의 활동으로 생긴 알림도 반영되도록 폴링. */
export const useUnreadNotificationCount = () => {
  const { data = 0, ...query } = useQuery({
    queryKey: NOTIFICATION_QUERY_KEYS.unreadCount(),
    queryFn: notificationApi.getUnreadCount,
    refetchInterval: REALTIME_POLL_INTERVAL_MS,
    meta: { skipGlobalError: true }, // 배지 폴링 실패로 모달 반복 방지
  });

  return { unreadCount: data, ...query };
};
