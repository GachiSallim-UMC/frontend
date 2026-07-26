import { useState } from 'react';
import { createPayLink } from '@/features/expense';
import type { MemberShare } from '@/features/expense';

export function useCreatePayLink() {
  const [isLoading, setIsLoading] = useState(false);

  const requestPayLink = async (share?: MemberShare) => {
    if (!share) {
      alert('본인의 정산 내역을 찾을 수 없습니다.');
      return;
    }
    if (share.isPaid) {
      alert('이미 정산 완료된 항목입니다.');
      return;
    }

    setIsLoading(true);
    try {
      const result = await createPayLink(share.id);
      console.log('paylink 응답:', result);

      const payUrl = result?.paylink ?? result?.url;
      console.log('추출된 payUrl:', payUrl);

      // 확인 전까지는 실제 이동 막아둠
      // if (payUrl) {
      //   window.open(payUrl, '_blank');
      // } else {
      //   alert('송금 링크를 가져오지 못했습니다.');
      // }
    } catch (err) {
      console.error('송금 링크 생성 실패:', err);
      alert('송금 링크 생성 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return { requestPayLink, isLoading };
}