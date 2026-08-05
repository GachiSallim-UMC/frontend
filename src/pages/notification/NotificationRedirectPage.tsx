import { Navigate, useParams } from 'react-router-dom';
import { useNotifications } from '@/features/notification';

/** 웹 푸시 알림 클릭 시 진입(/notifications/:id) — 단건 조회 API가 없어 목록에서 id로 찾아 실제 목적지로 리다이렉트한다. */
export const NotificationRedirectPage = () => {
  const { id } = useParams<{ id: string }>();
  const { isLoading, filteredNotifications } = useNotifications();

  if (isLoading) {
    return (
      <div className="flex w-full flex-1 items-center justify-center">
        <span className="h-6 w-6 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />
        <span className="ml-3 text-sm text-gray-600">알림을 불러오는 중입니다</span>
      </div>
    );
  }

  const notification = filteredNotifications.find(n => n.id === id);

  return <Navigate to={notification?.route ?? '/notifications'} replace />;
};
