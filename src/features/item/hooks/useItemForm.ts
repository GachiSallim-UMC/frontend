import { useState } from 'react';
import type { ItemStatus } from '@/shared/types';
import type { Item, ItemCategory } from '../types/item.types';

export const ITEM_STATUS_OPTIONS: { value: ItemStatus; label: string }[] = [
  { value: 'enough', label: '충분' },
  { value: 'short', label: '부족' },
  { value: 'empty', label: '소진' },
];

/** 물품 등록·수정 폼 상태 (editingItem이 있으면 값 프리필) */
export const useItemForm = (editingItem?: Item) => {
  const [name, setName] = useState(editingItem?.name ?? '');
  const [category, setCategory] = useState<ItemCategory | ''>(editingItem?.category ?? '');
  const [status, setStatus] = useState<ItemStatus | ''>(editingItem?.status ?? '');
  const [buyerId, setBuyerId] = useState(editingItem?.buyer?.id ?? '');
  const [memo, setMemo] = useState(editingItem?.memo ?? '');

  return {
    name,
    setName,
    category,
    setCategory,
    status,
    setStatus,
    buyerId,
    setBuyerId,
    memo,
    setMemo,
  };
};
