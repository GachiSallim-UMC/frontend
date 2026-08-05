import { apiClient } from '@/shared/api';
import type { Notification, NotificationResponse } from '../types/notification.type';
import type { NotificationPreferencesDto } from '@/features/mypage'

const BASE = '/notifications';

type NotificationType =
  | 'CHORE_DUE'
  | 'EXPENSE_REQUEST'
  | 'EXPENSE_DONE'
  | 'SUPPLY_LOW'
  | 'RULE_CHANGED'
  | 'NEW_MESSAGE'
  | 'GROUP_INVITE';

/** getRoute는 refId가 있으면 상세 화면으로, 없으면 목록 화면으로 이동합니다. */
const NOTIFICATION_TYPE_META: Record<NotificationType, { category: string; getRoute: (refId: number | null) => string }> = {
  CHORE_DUE: {
    category: '집안일',
    getRoute: () => '/chores',
  },
  EXPENSE_REQUEST: {
    category: '정산',
    getRoute: refId => (refId !== null ? `/expenses/${refId}` : '/expenses'),
  },
  EXPENSE_DONE: {
    category: '정산',
    getRoute: refId => (refId !== null ? `/expenses/${refId}` : '/expenses'),
  },
  SUPPLY_LOW: {
    category: '물품',
    getRoute: () => '/items',
  },
  RULE_CHANGED: {
    category: '규칙',
    getRoute: refId => (refId !== null ? `/rules/${refId}` : '/rules'),
  },
  NEW_MESSAGE: {
    category: '메신저',
    getRoute: refId => (refId !== null ? `/messenger?roomId=${refId}` : '/messenger'),
  },
  GROUP_INVITE: {
    category: '그룹',
    getRoute: () => '/group',
  },
};

/** 카테고리 필터 옵션 — NOTIFICATION_TYPE_META에서 자동 추출되므로 여기서 따로 관리하지 않습니다. */
export const NOTIFICATION_CATEGORIES = Array.from(
  new Set(Object.values(NOTIFICATION_TYPE_META).map(meta => meta.category)),
);

/** 목록에 없는(구버전 프론트가 모르는 새 enum 값) type을 위한 안전한 기본값 */
const DEFAULT_TYPE_META = { category: '기타', getRoute: (): string | null => null };

const isNotificationType = (type: string): type is NotificationType => type in NOTIFICATION_TYPE_META;

const getTypeMeta = (type: string) =>
  isNotificationType(type) ? NOTIFICATION_TYPE_META[type] : DEFAULT_TYPE_META;

const getCategory = (type: string): string => getTypeMeta(type).category;

const getTitle = (type: string): string => {
  const category = getCategory(type);
  return category === '기타' ? '알림' : `${category} 알림`;
};

const getRoute = (type: string, refId: number | null): string | null =>
  getTypeMeta(type).getRoute(refId);

const formatNotificationTime = (isoString: string): string => {
  const target = new Date(isoString);
  const diffMs = Date.now() - target.getTime();
  const diffMin = Math.floor(diffMs / (60 * 1000));
  const diffHour = Math.floor(diffMs / (60 * 60 * 1000));
  const diffDay = Math.floor(diffMs / (24 * 60 * 60 * 1000));

  if (diffMin < 1) return '방금 전';
  if (diffMin < 60) return `${diffMin}분 전`;
  if (diffHour < 24) return `${diffHour}시간 전`;
  return `${diffDay}일 전`;
};

const toNotification = (res: NotificationResponse): Notification => ({
  id: String(res.notificationId),
  title: getTitle(res.type),
  message: res.message,
  time: formatNotificationTime(res.createdAt),
  category: getCategory(res.type),
  isRead: res.isRead,
  route: getRoute(res.type, res.refId),
});

export const notificationApi = {
  list: async (): Promise<Notification[]> => {
    const { data } = await apiClient.get<{ notifications: NotificationResponse[] }>(BASE);
    return data.notifications.map(toNotification);
  },

  getUnreadCount: async (): Promise<number> => {
    const { data } = await apiClient.get<{ unreadCount: number }>(`${BASE}/unread-count`);
    return data.unreadCount;
  },

  markAsRead: async (notificationId: string): Promise<void> => {
    await apiClient.patch(`${BASE}/${notificationId}/read`);
  },

  markAllAsRead: async (): Promise<number> => {
    const { data } = await apiClient.patch<{ updatedCount: number }>(`${BASE}/read-all`);
    return data.updatedCount;
  },

  hide: async (notificationId: string): Promise<void> => {
    await apiClient.delete(`${BASE}/${notificationId}`);
  },

  getPreferences: async (): Promise<NotificationPreferencesDto> => {
    const { data } = await apiClient.get(`${BASE}/preferences`);
    return data; 
  },
  updatePreferences: async (payload: NotificationPreferencesDto): Promise<NotificationPreferencesDto> => {
    const { data } = await apiClient.patch(`${BASE}/preferences`, payload);
    return data;
  },
};
