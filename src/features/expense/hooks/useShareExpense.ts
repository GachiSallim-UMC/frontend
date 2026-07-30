import { useState } from 'react';
import { shareExpenseCard } from '@/features/expense';
import { useErrorStore } from '@/shared/store';

export function useShareExpense() {
  const [isSharing, setIsSharing] = useState(false);

  const shareExpense = async (expenseId?: number | string) => {
    if (!expenseId) {
      useErrorStore.getState().showError({
        title: '알림',
        message: '저장된 지출만 공유할 수 있습니다.',
      });
      return;
    }

    setIsSharing(true);

    try {
      await shareExpenseCard(expenseId);

      useErrorStore.getState().showError({
        title: '완료',
        message: '그룹 채팅방에 공유되었습니다.',
      });
    } catch (err) {
      console.error('공유 실패:', err);

      useErrorStore.getState().showError({
        title: '오류',
        message: '공유 중 오류가 발생했습니다.',
      });
    } finally {
      setIsSharing(false);
    }
  };

  return { shareExpense, isSharing };
}