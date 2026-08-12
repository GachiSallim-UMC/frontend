import { useState } from 'react';
import type { EditableItemStatus, Item, ItemCategory } from '@/features/item/types/item.types';

export const ITEM_STATUS_OPTIONS: { value: EditableItemStatus; label: string }[] = [
  { value: 'enough', label: '충분' },
  { value: 'short', label: '부족' },
  { value: 'empty', label: '소진' },
];

/** 물품 등록·수정 폼 상태 (editingItem이 있으면 값 프리필) */
export const useItemForm = (editingItem?: Item) => {
  const [name, setName] = useState(editingItem?.name ?? '');
  const [category, setCategory] = useState<ItemCategory | ''>(editingItem?.category ?? '');
  // PURCHASED는 구매 API에서만 만드는 상태다. 빈 값은 정보 수정 시 현재 상태 유지를 뜻한다.
  const initialStatus = editingItem?.status === 'purchased' ? '' : editingItem?.status;
  const [status, setStatus] = useState<EditableItemStatus | ''>(initialStatus ?? '');
  const [buyerId, setBuyerId] = useState(editingItem?.buyer?.id ?? '');
  const [memo, setMemo] = useState(editingItem?.memo ?? '');

  const isDirty =
    name.trim() !== (editingItem?.name ?? '').trim() ||
    category !== (editingItem?.category ?? '') ||
    status !== (initialStatus ?? '') ||
    String(buyerId) !== String(editingItem?.buyer?.id ?? '') ||
    memo.trim() !== (editingItem?.memo ?? '').trim();

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
    isDirty,
  };
};
