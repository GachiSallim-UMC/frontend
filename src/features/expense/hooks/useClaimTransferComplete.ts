import { useState } from 'react';
import { claimTransferComplete } from '@/features/expense/';


export const useClaimTransferComplete = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const requestTransferComplete = async (
    splitId: number | string,
  ): Promise<boolean> => {
    if (isLoading) return false;

    setIsLoading(true);
    setError(null);

    try {
      await claimTransferComplete(splitId);
      return true;
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : '송금 완료 처리 중 오류가 발생했습니다.';

      setError(message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    requestTransferComplete,
    isLoading,
    error,
  };
};