import type { Status, User } from '@/shared/types';

/** 기존 화면에서 사용하는 집안일 카테고리 */
export type ChoreCategory =
  | 'cleaning'
  | 'dishes'
  | 'laundry'
  | 'trash'
  | 'organizing'
  | 'shopping'
  | 'cooking'
  | 'pets_plants'
  | 'etc';

/** 기존 화면에서 사용하는 반복 유형 */
export type RepeatType = 'once' | 'daily' | 'weekly' | 'monthly' | 'custom';

/** 기존 화면에서 사용하는 요일 */
export type DayOfWeek = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';

export type CustomOption = 'every_n_days' | 'every_n_weeks' | 'every_n_months' | 'specific_days';

/** 대시보드·메신저 등 기존 UI가 공유하는 집안일 모델 */
export interface Chore {
  id: string;
  name: string;
  assignee: User;
  category: ChoreCategory;
  repeatType: RepeatType;
  customOption?: CustomOption;
  repeatInterval?: number;
  repeatDays: DayOfWeek[];
  startDate: string;
  endDate?: string;
  status: Status;
  memo?: string;
}

export type ChoreApiStatus = 'PENDING' | 'DONE';

export type ChoreApiCategory =
  | 'CLEANING'
  | 'DISHWASHING'
  | 'LAUNDRY'
  | 'TRASH'
  | 'TIDYING'
  | 'SHOPPING'
  | 'COOKING'
  | 'PET_PLANT'
  | 'ETC';

export type ChoreApiRepeatType = 'NONE' | 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'CUSTOM';

export type ChoreApiDayOfWeek = 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT' | 'SUN';

export type ChoreApiCustomOption =
  | 'EVERY_N_DAYS'
  | 'EVERY_N_WEEKS'
  | 'EVERY_N_MONTHS'
  | 'SPECIFIC_DAYS';

export interface ChoreApiUser {
  userId: number;
  nickname: string;
}

/** GET /chores 목록 항목 응답 */
export interface ChoreListItemResponse {
  choreId: number;
  groupId: number;
  parentId: number | null;
  title: string;
  category: ChoreApiCategory;
  assignee: ChoreApiUser;
  startDate: string;
  dueDate: string | null;
  repeatType: ChoreApiRepeatType;
  customOption: ChoreApiCustomOption | null;
  repeatInterval: number | null;
  repeatDays: ChoreApiDayOfWeek[];
  memo: string | null;
  status: ChoreApiStatus;
  completedBy: ChoreApiUser | null;
  completedAt: string | null;
  createdBy: ChoreApiUser;
  createdAt: string;
  updatedAt: string;
}

/** 등록·수정 응답은 동작별로 일부 메타 필드가 생략될 수 있습니다. */
export interface ChoreMutationResponse {
  choreId: number;
  groupId: number;
  parentId: number | null;
  title: string;
  category: ChoreApiCategory;
  assignee: ChoreApiUser;
  startDate: string;
  dueDate: string | null;
  repeatType: ChoreApiRepeatType;
  customOption: ChoreApiCustomOption | null;
  repeatInterval: number | null;
  repeatDays: ChoreApiDayOfWeek[];
  memo: string | null;
  status: ChoreApiStatus;
  createdBy?: ChoreApiUser;
  createdAt?: string;
  updatedAt: string;
}

export interface CreateChoreDto {
  groupId: number;
  title: string;
  category: ChoreApiCategory;
  assigneeId: number;
  startDate: string;
  dueDate?: string;
  repeatType: ChoreApiRepeatType;
  customOption?: ChoreApiCustomOption;
  repeatInterval?: number;
  repeatDays?: ChoreApiDayOfWeek[];
  memo?: string;
}

export type UpdateChoreDto = Omit<CreateChoreDto, 'groupId'>;

export interface ShareChoreDto {
  chatRoomId: number;
  content?: string;
}

export interface ShareChoreResponse {
  choreId: number;
  chatMessageId: number;
  shareCard: {
    title: string;
    assignee: string;
    dueDate: string | null;
    status: ChoreApiStatus;
  };
  sentAt: string;
}

export interface ChoreFilter {
  status?: ChoreApiStatus;
  assigneeId?: number;
  keyword?: string;
  repeatType?: ChoreApiRepeatType;
}

export interface GetChoresParams {
  groupId: number;
  status?: ChoreApiStatus;
  assigneeId?: number;
}

export interface IncompleteChoreResponse {
  choreId: number;
  status: string;
  completedBy: unknown | null;
  completedAt: string | null;
  removedNextOccurrenceIds: number[];
}
