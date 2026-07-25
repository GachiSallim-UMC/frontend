export interface NotificationResponse {
  notificationId: number;
  groupId: number | null;
  type: string;
  refId: number | null;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  category: string;
  isRead: boolean;
  route: string | null;
}
