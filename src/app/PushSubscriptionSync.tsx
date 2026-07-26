import { useEffect, useRef } from 'react';
import { useAuthStore } from '@/shared/store';
import { usePushSubscription } from '@/features/notification';

// auth와 notification 도메인을 조합하므로 app 레이어에 둔다
export const PushSubscriptionSync = () => {
  const accessToken = useAuthStore(s => s.accessToken);
  const isAuthenticated = Boolean(accessToken);
  const { subscribe, unsubscribe } = usePushSubscription();
  const wasAuthenticated = useRef(false);
  // 로그아웃으로 accessToken이 비워지기 전 값을 붙잡아 해제 요청에 사용
  const lastAccessTokenRef = useRef<string | null>(null);
  if (accessToken) lastAccessTokenRef.current = accessToken;

  useEffect(() => {
    if (isAuthenticated) {
      subscribe();
    } else if (wasAuthenticated.current) {
      unsubscribe(lastAccessTokenRef.current ?? undefined);
    }

    wasAuthenticated.current = isAuthenticated;
  }, [isAuthenticated, subscribe, unsubscribe]);

  return null;
};
