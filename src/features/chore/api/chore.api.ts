import { ApiError, apiClient } from '@/shared/api';
import type {
  Chore,
  ChoreApiCategory,
  ChoreApiCustomOption,
  ChoreApiDayOfWeek,
  ChoreApiRepeatType,
  ChoreApiStatus,
  ChoreApiUser,
  ChoreCategory,
  ChoreListItemResponse,
  ChoreMutationResponse,
  CreateChoreDto,
  CustomOption,
  DayOfWeek,
  GetChoresParams,
  RepeatType,
  ShareChoreDto,
  ShareChoreResponse,
  UpdateChoreDto,
  IncompleteChoreResponse,
} from '../types/chore.types';

const BASE = '/chores';

const CATEGORY_FROM_API: Record<ChoreApiCategory, ChoreCategory> = {
  CLEANING: 'cleaning',
  DISHWASHING: 'dishes',
  LAUNDRY: 'laundry',
  TRASH: 'trash',
  TIDYING: 'organizing',
  SHOPPING: 'shopping',
  COOKING: 'cooking',
  PET_PLANT: 'pets_plants',
  ETC: 'etc',
};

const REPEAT_TYPE_FROM_API: Record<ChoreApiRepeatType, RepeatType> = {
  NONE: 'once',
  DAILY: 'daily',
  WEEKLY: 'weekly',
  MONTHLY: 'monthly',
  CUSTOM: 'custom',
};

const CUSTOM_OPTION_FROM_API: Record<ChoreApiCustomOption, CustomOption> = {
  EVERY_N_DAYS: 'every_n_days',
  EVERY_N_WEEKS: 'every_n_weeks',
  EVERY_N_MONTHS: 'every_n_months',
  SPECIFIC_DAYS: 'specific_days',
};

const DAY_FROM_API: Record<ChoreApiDayOfWeek, DayOfWeek> = {
  MON: 'mon',
  TUE: 'tue',
  WED: 'wed',
  THU: 'thu',
  FRI: 'fri',
  SAT: 'sat',
  SUN: 'sun',
};

const STATUS_FROM_API: Record<ChoreApiStatus, Chore['status']> = {
  PENDING: 'pending',
  DONE: 'done',
};

const API_CATEGORIES = new Set<ChoreApiCategory>(
  Object.keys(CATEGORY_FROM_API) as ChoreApiCategory[],
);
const API_REPEAT_TYPES = new Set<ChoreApiRepeatType>(
  Object.keys(REPEAT_TYPE_FROM_API) as ChoreApiRepeatType[],
);
const API_CUSTOM_OPTIONS = new Set<ChoreApiCustomOption>(
  Object.keys(CUSTOM_OPTION_FROM_API) as ChoreApiCustomOption[],
);
const API_DAYS = new Set<ChoreApiDayOfWeek>(Object.keys(DAY_FROM_API) as ChoreApiDayOfWeek[]);
const API_STATUSES = new Set<ChoreApiStatus>(Object.keys(STATUS_FROM_API) as ChoreApiStatus[]);

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const isNullableString = (value: unknown): value is string | null =>
  value === null || typeof value === 'string';

const isSafeInteger = (value: unknown): value is number =>
  typeof value === 'number' && Number.isSafeInteger(value);

const isChoreUser = (value: unknown): value is ChoreApiUser =>
  isRecord(value) && isSafeInteger(value.userId) && typeof value.nickname === 'string';

const isChoreListItem = (value: unknown): value is ChoreListItemResponse =>
  isRecord(value) &&
  isSafeInteger(value.choreId) &&
  isSafeInteger(value.groupId) &&
  (value.parentId === null || isSafeInteger(value.parentId)) &&
  typeof value.title === 'string' &&
  API_CATEGORIES.has(value.category as ChoreApiCategory) &&
  isChoreUser(value.assignee) &&
  typeof value.startDate === 'string' &&
  isNullableString(value.dueDate) &&
  API_REPEAT_TYPES.has(value.repeatType as ChoreApiRepeatType) &&
  (value.customOption === null ||
    API_CUSTOM_OPTIONS.has(value.customOption as ChoreApiCustomOption)) &&
  (value.repeatInterval === null || isSafeInteger(value.repeatInterval)) &&
  Array.isArray(value.repeatDays) &&
  value.repeatDays.every(day => API_DAYS.has(day as ChoreApiDayOfWeek)) &&
  isNullableString(value.memo) &&
  API_STATUSES.has(value.status as ChoreApiStatus) &&
  (value.completedBy === null || isChoreUser(value.completedBy)) &&
  isNullableString(value.completedAt) &&
  isChoreUser(value.createdBy) &&
  typeof value.createdAt === 'string' &&
  typeof value.updatedAt === 'string';

const calculateChoreStatus = (
  completedAt: string | null,
  dueDate: string | null,
): Chore['status'] => {
  if (completedAt !== null) {
    return 'done';
  }

  if (dueDate !== null) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const due = new Date(dueDate);
    due.setHours(0, 0, 0, 0);

    if (due <= today) {
      return 'pending';
    }
  }

  return 'scheduled';
};

/** API 응답을 기존 대시보드·메신저가 사용하는 UI 모델로 변환합니다. */
export const toChore = (response: ChoreListItemResponse): Chore => ({
  id: String(response.choreId),
  name: response.title,
  assignee: {
    id: String(response.assignee.userId),
    name: response.assignee.nickname,
    nickname: response.assignee.nickname,
    email: '',
  },
  category: CATEGORY_FROM_API[response.category],
  repeatType: REPEAT_TYPE_FROM_API[response.repeatType],
  customOption:
    response.customOption === null ? undefined : CUSTOM_OPTION_FROM_API[response.customOption],
  repeatInterval: response.repeatInterval ?? undefined,
  repeatDays: response.repeatDays.map(day => DAY_FROM_API[day]),
  startDate: response.startDate,
  endDate: response.dueDate ?? undefined,
  status: calculateChoreStatus(response.completedAt, response.dueDate || response.startDate),
  memo: response.memo ?? undefined,
});

export const choreApi = {
  getList: async (params: GetChoresParams): Promise<ChoreListItemResponse[]> => {
    const { data } = await apiClient.get<ChoreListItemResponse[]>(BASE, { params });
    if (!Array.isArray(data) || !data.every(isChoreListItem)) {
      throw new ApiError(502, 'INVALID_API_RESPONSE', '집안일 목록 응답 형식이 올바르지 않습니다.');
    }
    return data;
  },

  create: async (dto: CreateChoreDto): Promise<ChoreMutationResponse> => {
    const { data } = await apiClient.post<ChoreMutationResponse>(BASE, dto);
    return data;
  },

  update: async (id: string, dto: UpdateChoreDto): Promise<ChoreMutationResponse> => {
    const { data } = await apiClient.put<ChoreMutationResponse>(`${BASE}/${id}`, dto);
    return data;
  },

  remove: async (id: string): Promise<void> => {
    await apiClient.delete(`${BASE}/${id}`);
  },

  complete: async (id: string): Promise<void> => {
    await apiClient.patch(`${BASE}/${id}/complete`);
  },

  incomplete: async (id: string): Promise<IncompleteChoreResponse> => {
    const { data } = await apiClient.patch<{ data: IncompleteChoreResponse }>(
      `${BASE}/${id}/incomplete`,
    );
    return data.data;
  },

  share: async (id: string, dto: ShareChoreDto): Promise<ShareChoreResponse> => {
    const { data } = await apiClient.post<ShareChoreResponse>(`${BASE}/${id}/share`, dto);
    return data;
  },
};
