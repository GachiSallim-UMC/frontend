import { useEffect, useRef } from 'react';
import { useAuthStore } from '@/shared/store';
import { usePushSubscription } from '@/features/notification';

/** 로그인 상태 변화를 감지해 웹 푸시 구독을 등록·해제합니다. auth와 notification 도메인을 조합하므로 app 레이어에 둡니다. */
export const PushSubscriptionSync = () => {
  const isAuthenticated = useAuthStore(s => Boolean(s.accessToken));
  const { subscribe, unsubscribe } = usePushSubscription();
  const wasAuthenticated = useRef(false);

  useEffect(() => {
    if (isAuthenticated) {
      subscribe();
    } else if (wasAuthenticated.current) {
      unsubscribe();
    }

    wasAuthenticated.current = isAuthenticated;
  }, [isAuthenticated, subscribe, unsubscribe]);

  return null;
};
