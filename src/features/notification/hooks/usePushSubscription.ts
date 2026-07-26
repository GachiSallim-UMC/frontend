import { useCallback } from 'react';
import { pushSubscriptionApi } from '@/features/notification/api/pushSubscription.api';

const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY as string | undefined;
const SUBSCRIPTION_ID_STORAGE_KEY = 'gachi-salim-push-subscription-id';

const urlBase64ToUint8Array = (base64String: string): Uint8Array => {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  return Uint8Array.from([...rawData].map(char => char.charCodeAt(0)));
};

const isPushSupported = () =>
  'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;

export const usePushSubscription = () => {
  const subscribe = useCallback(async () => {
    if (!isPushSupported() || !VAPID_PUBLIC_KEY) return;
    if (Notification.permission !== 'granted') return;

    try {
      const registration = await navigator.serviceWorker.register('/sw.js');

      let subscription = await registration.pushManager.getSubscription();
      if (!subscription) {
        subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
        });
      }

      const json = subscription.toJSON();
      if (!json.endpoint || !json.keys?.p256dh || !json.keys?.auth) return;

      const { subscriptionId } = await pushSubscriptionApi.subscribe({
        endpoint: json.endpoint,
        keys: { p256dh: json.keys.p256dh, auth: json.keys.auth },
      });

      localStorage.setItem(SUBSCRIPTION_ID_STORAGE_KEY, String(subscriptionId));
    } catch {
      // 미지원 브라우저 등은 조용히 무시
    }
  }, []);

  // 권한 팝업은 사용자 제스처 안에서 동기 호출해야 뜬다 — 로그인 버튼 핸들러에서 await 없이 호출
  const requestPermission = useCallback(() => {
    if (!isPushSupported() || Notification.permission !== 'default') return;
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') void subscribe();
    });
  }, [subscribe]);

  // 로그아웃 후엔 accessToken이 이미 비어 apiClient가 헤더를 못 붙이므로, 호출부에서 직전 토큰을 넘겨받는다
  const unsubscribe = useCallback(async (accessToken?: string) => {
    const storedId = localStorage.getItem(SUBSCRIPTION_ID_STORAGE_KEY);
    if (!storedId) return;

    localStorage.removeItem(SUBSCRIPTION_ID_STORAGE_KEY);

    try {
      await pushSubscriptionApi.unsubscribe(Number(storedId), accessToken);
    } catch {
      // 실패해도 로그아웃 흐름은 막지 않음
    }

    try {
      const registration = await navigator.serviceWorker.getRegistration();
      const subscription = await registration?.pushManager.getSubscription();
      await subscription?.unsubscribe();
    } catch {
      // no-op
    }
  }, []);

  return { requestPermission, subscribe, unsubscribe };
};
