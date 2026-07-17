import { useState, useMemo } from 'react';
import type { Notification } from '@/features/notification/types';

export const useNotifications = (initialData: Notification[]) => {
  const [statusFilter, setStatusFilter] = useState('전체');
  const [categoryFilter, setCategoryFilter] = useState('전체');

  const [notifications, setNotifications] = useState<Notification[]>(() =>
    initialData.map((n) => ({
      ...n,
      isRead: n.status === 'done' || n.status === 'empty',
    }))
  );

  const statusOptions = ['전체', '읽지 않음', '읽음'];
  const categoryOptions = ['전체', '집안일', '정산', '물품', '규칙', '메신저', '그룹'];

  const filteredNotifications = useMemo(() => {
    return notifications.filter((n) => {
      const matchesStatus =
        statusFilter === '전체'
          ? true
          : statusFilter === '읽지 않음'
            ? !n.isRead
            : n.isRead;

      const matchesCategory =
        categoryFilter === '전체' ? true : n.title.includes(categoryFilter);

      return matchesStatus && matchesCategory;
    });
  }, [notifications, statusFilter, categoryFilter]);

  const markAllAsRead = () => {
    setNotifications((prev) =>
      prev.map((n) => ({ ...n, isRead: true }))
    );
  };

  return {
    statusFilter,
    setStatusFilter,
    statusOptions,
    categoryFilter,
    setCategoryFilter,
    categoryOptions,
    filteredNotifications,
    markAllAsRead,
  };
};
