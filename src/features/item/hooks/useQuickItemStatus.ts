import { useState } from 'react';
import type { ItemStatus } from '@/shared/types';

/** 목록에서 물품을 선택해 상태만 빠르게 바꾸는 위젯의 상태 */
export const useQuickItemStatus = () => {
  const [itemId, setItemId] = useState('');
  const [status, setStatus] = useState<ItemStatus | ''>('');

  return { itemId, setItemId, status, setStatus };
};
