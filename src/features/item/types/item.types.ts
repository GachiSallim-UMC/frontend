import type { ItemStatus, User } from '@/shared/types';

/** 공용 물품 카테고리 */
export type ItemCategory = 'daily' | 'kitchen' | 'bathroom' | 'cleaning' | 'grocery' | 'medicine' | 'pet' | 'tool' | 'etc';

/** 공용 물품 도메인 모델 */
export interface Item {
  id: string;
  name: string;
  category: ItemCategory;
  buyer?: User;
  status: ItemStatus;
  updatedAt: string;
  memo?: string;
}

/** 공용 물품 등록 DTO */
export interface CreateItemDto {
  name: string;
  category: ItemCategory;
  buyerId?: string;
  status: ItemStatus;
  memo?: string;
}
