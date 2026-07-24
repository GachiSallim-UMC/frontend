import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { notificationApi } from '@/features/notification/api/notification.api';

export const NOTIFICATION_QUERY_KEYS = {
  all: ['notifications'] as const,
  list: () => [...NOTIFICATION_QUERY_KEYS.all, 'list'] as const,
  unreadCount: () => [...NOTIFICATION_QUERY_KEYS.all, 'unread-count'] as const,
};

export const useNotifications = () => {
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState('전체');
  const [categoryFilter, setCategoryFilter] = useState('전체');

  const {
    data: notifications = [],
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: NOTIFICATION_QUERY_KEYS.list(),
    queryFn: notificationApi.list,
  });

  const statusOptions = ['전체', '읽지 않음', '읽음'];
  const categoryOptions = ['전체', '집안일', '정산', '물품', '규칙', '메신저', '그룹'];

  const filteredNotifications = useMemo(() => {
    return notifications.filter((n) => {
      const matchesStatus =
        statusFilter === '전체' ? true : statusFilter === '읽지 않음' ? !n.isRead : n.isRead;

      const matchesCategory = categoryFilter === '전체' ? true : n.category === categoryFilter;

      return matchesStatus && matchesCategory;
    });
  }, [notifications, statusFilter, categoryFilter]);

  const invalidateList = () => {
    queryClient.invalidateQueries({ queryKey: NOTIFICATION_QUERY_KEYS.all });
  };

  const markAsReadMutation = useMutation({
    mutationFn: (id: string) => notificationApi.markAsRead(id),
    onSuccess: invalidateList,
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: notificationApi.markAllAsRead,
    onSuccess: invalidateList,
  });

  const hideMutation = useMutation({
    mutationFn: (id: string) => notificationApi.hide(id),
    onSuccess: invalidateList,
  });

  return {
    isLoading,
    isError,
    refetch,
    statusFilter,
    setStatusFilter,
    statusOptions,
    categoryFilter,
    setCategoryFilter,
    categoryOptions,
    filteredNotifications,
    markAsRead: markAsReadMutation.mutate,
    markAllAsRead: markAllAsReadMutation.mutate,
    hideNotification: hideMutation.mutate,
  };
};
