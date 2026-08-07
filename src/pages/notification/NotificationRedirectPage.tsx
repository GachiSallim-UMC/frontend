import { useEffect } from 'react';
import { Navigate, useParams, useSearchParams } from 'react-router-dom';
import { useNotifications } from '@/features/notification';
import { useGroupStore } from '@/shared/store';

/** 웹 푸시 알림 클릭 시 진입(/notifications/:id) — 단건 조회 API가 없어 목록에서 id로 찾아 실제 목적지로 리다이렉트한다. */
export const NotificationRedirectPage = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const pushGroupId = searchParams.get('groupId');

  const selectedGroupId = useGroupStore(state => state.selectedGroupId);
  const setSelectedGroupId = useGroupStore(state => state.setSelectedGroupId);
  const isSwitchingGroup = Boolean(pushGroupId) && pushGroupId !== selectedGroupId;

  // 알림이 지금 보고 있는 그룹과 다른 그룹 것이면(push url의 groupId), 검색 전에 먼저 그 그룹으로 전환한다.
  useEffect(() => {
    if (pushGroupId && pushGroupId !== selectedGroupId) {
      setSelectedGroupId(pushGroupId);
    }
  }, [pushGroupId, selectedGroupId, setSelectedGroupId]);

  const { isLoading, filteredNotifications } = useNotifications();

  if (isSwitchingGroup || isLoading) {
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
