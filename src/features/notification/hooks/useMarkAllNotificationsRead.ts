import { useMutation, useQueryClient } from '@tanstack/react-query';
import { notificationApi } from '@/features/notification/api/notification.api';
import { NOTIFICATION_QUERY_KEYS } from './useNotifications';

/** 모바일 상단 헤더의 "전체 읽음" 같이 알림 목록을 이미 들고 있지 않은 곳에서 전체 읽음 처리만 필요할 때 사용. */
export const useMarkAllNotificationsRead = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: notificationApi.markAllAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: NOTIFICATION_QUERY_KEYS.all });
    },
  });

  return { markAllAsRead: mutate, isPending };
};
