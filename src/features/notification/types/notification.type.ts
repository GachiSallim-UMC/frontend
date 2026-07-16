export interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  status: string;
  isRead?: boolean;
}
