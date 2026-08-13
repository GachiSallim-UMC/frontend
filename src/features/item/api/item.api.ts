import {
  ApiError,
  apiClient,
  withSelectedGroupParams,
  withSelectedNumericGroupBody,
} from '@/shared/api';
import type { ItemStatus } from '@/shared/types';
import type {
  CreateItemDto,
  Item,
  PurchaseItemDto,
  SupplyCategory,
  SupplyResponse,
  SupplyStatus,
  UpdateItemDto,
  UpdateItemStatusDto,
} from '@/features/item/types/item.types';

const BASE = '/supplies';

const STATUS_FROM_API: Record<SupplyStatus, ItemStatus> = {
  SUFFICIENT: 'enough',
  LOW: 'short',
  EMPTY: 'empty',
  PURCHASED: 'purchased',
};

const STATUS_TO_API = {
  enough: 'SUFFICIENT',
  short: 'LOW',
  empty: 'EMPTY',
} as const;

const CATEGORY_FROM_API: Record<SupplyCategory, Item['category']> = {
  DAILY_NECESSITIES: 'daily',
  BATHROOM: 'bathroom',
  KITCHEN: 'kitchen',
  LAUNDRY_CLEANING: 'cleaning',
  FOOD: 'grocery',
  HEALTH_HYGIENE: 'medicine',
  PET_PLANT: 'pet',
  TOOLS_ETC: 'tool',
  ETC: 'etc',
};

const CATEGORY_TO_API: Record<Item['category'], SupplyCategory> = {
  daily: 'DAILY_NECESSITIES',
  bathroom: 'BATHROOM',
  kitchen: 'KITCHEN',
  cleaning: 'LAUNDRY_CLEANING',
  grocery: 'FOOD',
  medicine: 'HEALTH_HYGIENE',
  pet: 'PET_PLANT',
  tool: 'TOOLS_ETC',
  etc: 'ETC',
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const isSupplyStatus = (value: unknown): value is SupplyStatus =>
  value === 'SUFFICIENT' || value === 'LOW' || value === 'EMPTY' || value === 'PURCHASED';

const isSupplyCategory = (value: unknown): value is SupplyCategory =>
  value === 'DAILY_NECESSITIES' ||
  value === 'BATHROOM' ||
  value === 'KITCHEN' ||
  value === 'LAUNDRY_CLEANING' ||
  value === 'FOOD' ||
  value === 'HEALTH_HYGIENE' ||
  value === 'PET_PLANT' ||
  value === 'TOOLS_ETC' ||
  value === 'ETC';

const isSupplyUser = (value: unknown): value is { userId: number; nickname: string } =>
  isRecord(value) &&
  typeof value.userId === 'number' &&
  Number.isSafeInteger(value.userId) &&
  typeof value.nickname === 'string';

const isSupplyResponse = (value: unknown): value is SupplyResponse =>
  isRecord(value) &&
  typeof value.supplyId === 'number' &&
  Number.isSafeInteger(value.supplyId) &&
  typeof value.groupId === 'number' &&
  Number.isSafeInteger(value.groupId) &&
  typeof value.name === 'string' &&
  isSupplyCategory(value.category) &&
  (value.assignee === null || isSupplyUser(value.assignee)) &&
  isSupplyStatus(value.status) &&
  (value.linkedExpenseId === null ||
    (typeof value.linkedExpenseId === 'number' && Number.isSafeInteger(value.linkedExpenseId))) &&
  isSupplyUser(value.createdBy) &&
  typeof value.createdAt === 'string' &&
  typeof value.updatedAt === 'string' &&
  (value.memo === null || typeof value.memo === 'string');

const assertSupplyResponse = (value: unknown): SupplyResponse => {
  if (!isSupplyResponse(value)) {
    throw new ApiError(502, 'INVALID_API_RESPONSE', '공용물품 응답 형식이 올바르지 않습니다.');
  }
  return value;
};

const toItem = (supply: SupplyResponse): Item => ({
  id: String(supply.supplyId),
  groupId: String(supply.groupId),
  name: supply.name,
  category: CATEGORY_FROM_API[supply.category],
  buyer: supply.assignee
    ? {
        id: String(supply.assignee.userId),
        name: supply.assignee.nickname,
        nickname: supply.assignee.nickname,
      }
    : undefined,
  createdBy: {
    id: String(supply.createdBy.userId),
    name: supply.createdBy.nickname,
    nickname: supply.createdBy.nickname,
  },
  status: STATUS_FROM_API[supply.status],
  linkedExpenseId: supply.linkedExpenseId === null ? null : String(supply.linkedExpenseId),
  createdAt: supply.createdAt,
  updatedAt: supply.updatedAt,
  memo: supply.memo ?? undefined,
});

const toSupplyCreateBody = (dto: CreateItemDto) => ({
  name: dto.name,
  category: CATEGORY_TO_API[dto.category],
  status: STATUS_TO_API[dto.status],
  ...(dto.assigneeId === undefined ? {} : { assigneeId: dto.assigneeId }),
  ...(dto.memo?.trim() ? { memo: dto.memo.trim() } : {}),
});

export const itemApi = {
  getList: async (): Promise<Item[]> => {
    const { data } = await apiClient.get<unknown>(BASE, {
      params: withSelectedGroupParams(),
    });

    if (!Array.isArray(data)) {
      throw new ApiError(
        502,
        'INVALID_API_RESPONSE',
        '공용물품 목록 응답 형식이 올바르지 않습니다.',
      );
    }

    return data.map(assertSupplyResponse).map(toItem);
  },

  create: async (dto: CreateItemDto): Promise<Item> => {
    const body = withSelectedNumericGroupBody(toSupplyCreateBody(dto));
    const { data } = await apiClient.post<unknown>(BASE, body);
    return toItem(assertSupplyResponse(data));
  },

  update: async (id: string, dto: UpdateItemDto): Promise<Item> => {
    const { data } = await apiClient.patch<unknown>(`${BASE}/${id}`, {
      name: dto.name,
      category: CATEGORY_TO_API[dto.category],
      assigneeId: dto.assigneeId,
      memo: dto.memo?.trim() || null,
    });
    return toItem(assertSupplyResponse(data));
  },

  updateStatus: async (id: string, dto: UpdateItemStatusDto): Promise<void> => {
    await apiClient.patch(`${BASE}/${id}/status`, {
      status: STATUS_TO_API[dto.status],
      ...(dto.note?.trim() ? { note: dto.note.trim() } : {}),
    });
  },

  purchase: async (id: string, dto: PurchaseItemDto): Promise<void> => {
    await apiClient.post(`${BASE}/${id}/purchase`, dto);
  },

  remove: async (id: string): Promise<void> => {
    await apiClient.delete(`${BASE}/${id}`);
  },
};
