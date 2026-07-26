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

/** 로그인/로그아웃 시점에 맞춰 웹 푸시 구독을 등록·해제하는 훅입니다. */
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
      // 미지원 브라우저·권한 거부 등은 사용자 흐름을 막지 않도록 조용히 무시합니다.
    }
  }, []);

  /**
   * 브라우저 알림 권한 팝업은 사용자 제스처(클릭) 컨텍스트에서 동기적으로 호출해야 뜹니다.
   * 로그인 버튼의 onClick/onSubmit 핸들러에서 await 없이 바로 호출하세요.
   * 권한이 허용되면 이어서 subscribe를 시도합니다(로그인 완료 전이면 실패하고,
   * 로그인 완료 후 PushSubscriptionSync가 다시 시도해 성공합니다).
   */
  const requestPermission = useCallback(() => {
    if (!isPushSupported() || Notification.permission !== 'default') return;
    Notification.requestPermission().then(permission => {
      if (permission === 'granted') void subscribe();
    });
  }, [subscribe]);

  const unsubscribe = useCallback(async () => {
    const storedId = localStorage.getItem(SUBSCRIPTION_ID_STORAGE_KEY);
    if (!storedId) return;

    localStorage.removeItem(SUBSCRIPTION_ID_STORAGE_KEY);

    try {
      await pushSubscriptionApi.unsubscribe(Number(storedId));
    } catch {
      // 로그아웃 흐름을 막지 않도록 실패는 무시합니다.
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
