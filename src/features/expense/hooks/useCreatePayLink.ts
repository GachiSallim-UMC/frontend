import { useState } from 'react';
import { createPayLink } from '@/features/expense';
import type { MemberShare } from '@/features/expense';
import { useErrorStore } from '@/shared/store';

export function useCreatePayLink() {
  const [isLoading, setIsLoading] = useState(false);

  const requestPayLink = async (share?: MemberShare) => {
    if (!share) {
      useErrorStore.getState().showError({
        title: '알림',
        message: '본인의 정산 내역을 찾을 수 없습니다.',
      });
      return;
    }

    if (share.isPaid) {
      useErrorStore.getState().showError({
        title: '알림',
        message: '이미 정산 완료된 항목입니다.',
      });
      return;
    }

    setIsLoading(true);

    try {
      const result = await createPayLink(share.id);

      console.log('paylink 응답:', result);
      console.log('deepLinkUrl:', result.deepLinkUrl);
      console.log('status:', result.status);

      if (!result.deepLinkUrl) {
        throw new Error('송금 링크가 응답에 없습니다.');
      }

      window.location.href = result.deepLinkUrl;
    } catch (err) {
      console.error('송금 링크 생성 실패:', err);

      useErrorStore.getState().showError({
        title: '오류',
        message: '송금 링크를 불러오지 못했습니다.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return { requestPayLink, isLoading };
}