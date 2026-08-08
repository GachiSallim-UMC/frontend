import { useState, useRef, useEffect } from 'react';
import { createPayLink } from '@/features/expense';
import type { MemberShare } from '@/features/expense';
import { useAlertStore } from '@/shared/store';

const DEEPLINK_FALLBACK_TIMEOUT = 2500;

export function useCreatePayLink() {
  const [isLoading, setIsLoading] = useState(false);

  const fallbackTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );
  const visibilityHandlerRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    return () => {
      if (fallbackTimerRef.current) {
        clearTimeout(fallbackTimerRef.current);
      }

      if (visibilityHandlerRef.current) {
        document.removeEventListener(
          'visibilitychange',
          visibilityHandlerRef.current,
        );
      }
    };
  }, []);

  const clearDeepLinkWatcher = () => {
    if (fallbackTimerRef.current) {
      clearTimeout(fallbackTimerRef.current);
      fallbackTimerRef.current = null;
    }

    if (visibilityHandlerRef.current) {
      document.removeEventListener(
        'visibilitychange',
        visibilityHandlerRef.current,
      );
      visibilityHandlerRef.current = null;
    }
  };

  const watchDeepLinkFallback = () => {
    clearDeepLinkWatcher();

    const handleVisibilityChange = () => {
      if (document.hidden) {
        clearDeepLinkWatcher();
      }
    };

    visibilityHandlerRef.current = handleVisibilityChange;

    document.addEventListener(
      'visibilitychange',
      handleVisibilityChange,
    );

    fallbackTimerRef.current = setTimeout(() => {
      if (!document.hidden) {
        useAlertStore.getState().showAlert({
          title: '토스 앱으로 이동할 수 없어요',
          message:
            '토스 앱이 설치되어 있지 않은 것 같아요. 앱을 설치한 후 다시 시도해 주세요.',
        });
      }

      clearDeepLinkWatcher();
    }, DEEPLINK_FALLBACK_TIMEOUT);
  };

  const requestPayLink = async (share?: MemberShare) => {
    if (!share) {
      useAlertStore.getState().showAlert({
        title: '알림',
        message: '본인의 정산 내역을 찾을 수 없습니다.',
      });
      return;
    }

    if (share.isPaid) {
      useAlertStore.getState().showAlert({
        title: '알림',
        message: '이미 정산 완료된 항목입니다.',
      });
      return;
    }

    const isMobile =
      /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

    if (!isMobile) {
      useAlertStore.getState().showAlert({
        title: '모바일에서 이용해 주세요',
        message: '송금 링크는 모바일에서만 이용할 수 있습니다.',
      });
      return;
    }

    setIsLoading(true);

    try {
      const result = await createPayLink(share.id);

      if (!result.deepLinkUrl) {
        throw new Error('송금 링크가 응답에 없습니다.');
      }

      watchDeepLinkFallback();

      window.location.href = result.deepLinkUrl;
    } catch (err) {
      console.error('송금 링크 생성 실패:', err);

      clearDeepLinkWatcher();

      useAlertStore.getState().showAlert({
        title: '오류',
        message: '송금 링크를 불러오지 못했습니다.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    requestPayLink,
    isLoading,
  };
}