import type { ItemStatus } from '@/shared/types';

export type SupplyStatus = 'SUFFICIENT' | 'LOW' | 'EMPTY' | 'PURCHASED';
export type SupplyCategory =
  | 'DAILY_NECESSITIES'
  | 'BATHROOM'
  | 'KITCHEN'
  | 'LAUNDRY_CLEANING'
  | 'FOOD'
  | 'HEALTH_HYGIENE'
  | 'PET_PLANT'
  | 'TOOLS_ETC'
  | 'ETC';
export type SupplyPurchaseCategory =
  | 'FINANCE'
  | 'FOOD'
  | 'SHOPPING'
  | 'EDUCATION'
  | 'GROCERY'
  | 'TRANSPORT'
  | 'LEISURE'
  | 'CAFE'
  | 'UTILITIES'
  | 'ETC';
export type EditableItemStatus = Exclude<ItemStatus, 'purchased'>;
export type ItemCategory =
  | 'daily'
  | 'kitchen'
  | 'bathroom'
  | 'cleaning'
  | 'grocery'
  | 'medicine'
  | 'pet'
  | 'tool'
  | 'etc';

export interface ItemUser {
  id: string;
  name: string;
  nickname: string;
  avatarUrl?: string;
}

/** 공용 물품 도메인 모델 */
export interface Item {
  id: string;
  name: string;
  category: ItemCategory;
  buyer?: ItemUser;
  createdBy?: ItemUser;
  status: ItemStatus;
  linkedExpenseId?: string | null;
  createdAt?: string;
  updatedAt: string;
  memo?: string;
}

/** 공용 물품 등록 DTO */
export interface CreateItemDto {
  name: string;
  category: ItemCategory;
  status: EditableItemStatus;
  assigneeId?: number;
  memo?: string;
}

export interface UpdateItemDto {
  name: string;
  category: ItemCategory;
  assigneeId: number | null;
  memo: string | null;
}

export interface UpdateItemStatusDto {
  status: EditableItemStatus;
  note?: string;
}

export interface PurchaseItemDto {
  category: SupplyPurchaseCategory;
  amount: number;
}

export interface SupplyResponse {
  supplyId: number;
  groupId: number;
  name: string;
  category: SupplyCategory;
  assignee: { userId: number; nickname: string } | null;
  status: SupplyStatus;
  linkedExpenseId: number | null;
  createdBy: { userId: number; nickname: string };
  createdAt: string;
  updatedAt: string;
  memo: string | null;
}
