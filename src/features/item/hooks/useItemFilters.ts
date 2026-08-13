import { useMemo, useState } from 'react';
import { toSelectOptions } from '@/shared/lib';
import type { Item, ItemCategory } from '@/features/item/types/item.types';

export const ITEM_CATEGORY_LABEL: Record<ItemCategory, string> = {
  daily: '생필품',
  bathroom: '욕실용품',
  kitchen: '주방용품',
  cleaning: '세탁/청소용품',
  grocery: '식료품',
  medicine: '의약/위생용품',
  pet: '반려동물/식물용품',
  tool: '공구/기타 생활용품',
  etc: '기타',
};

export const ITEM_CATEGORY_OPTIONS = toSelectOptions(ITEM_CATEGORY_LABEL);

export type ItemStatusFilter = 'all' | 'short' | 'empty';

export const ITEM_STATUS_FILTER_TABS: { value: ItemStatusFilter; label: string }[] = [
  { value: 'all', label: '전체 상태' },
  { value: 'short', label: '부족' },
  { value: 'empty', label: '소진' },
];

/** 공용 물품 목록 필터링 상태 및 파생 값 */
export const useItemFilters = (items: Item[]) => {
  const [statusFilter, setStatusFilter] = useState<ItemStatusFilter>('all');
  const [categoryFilter, setCategoryFilter] = useState<ItemCategory | ''>('');
  const [keyword, setKeyword] = useState('');

  const filteredItems = useMemo(
    () =>
      items.filter(item => {
        if (statusFilter !== 'all' && item.status !== statusFilter) return false;
        if (categoryFilter && item.category !== categoryFilter) return false;
        if (keyword && !item.name.includes(keyword)) return false;
        return true;
      }),
    [items, statusFilter, categoryFilter, keyword],
  );

  const shortCount = useMemo(() => items.filter(item => item.status === 'short').length, [items]);
  const emptyCount = useMemo(() => items.filter(item => item.status === 'empty').length, [items]);

  return {
    statusFilter,
    setStatusFilter,
    categoryFilter,
    setCategoryFilter,
    keyword,
    setKeyword,
    filteredItems,
    shortCount,
    emptyCount,
  };
};
