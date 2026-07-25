export interface ChoreUser {
  userId: number;
  nickname: string;
  avatarUrl?: string;
}

export type ChoreStatus = 'PENDING' | 'DONE';

/** 집안일 도메인 모델 */
export interface Chore {
  id?: string | number;
  choreId: number;
  groupId: number;
  parentId: number | null;
  title: string;
  assignee: ChoreUser | null;
  category?: ChoreCategory;
  repeatType: RepeatType;
  repeatDays?: DayOfWeek[];
  startDate: string;
  dueDate: string;
  status: ChoreStatus;
  memo?: string;
  completedBy: ChoreUser | null;
  completedAt: string | null;
  createdBy: ChoreUser;
  createdAt: string;
  updatedAt: string;
}

/** 집안일 카테고리 */
export type ChoreCategory =
  | 'CLEANING'
  | 'DISHWASHING'
  | 'LAUNDRY'
  | 'TRASH'
  | 'TIDYING'
  | 'SHOPPING'
  | 'COOKING'
  | 'PET_PLANT'
  | 'ETC';

/** 반복 유형 */
export type RepeatType = 'NONE' | 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'CUSTOM';

/** 요일 (반복 주기 설정용) */
export type DayOfWeek = 'MON' | 'TUE' | 'WED' | 'THU' | 'FRI' | 'SAT' | 'SUN';

//사용자 지정 유형
export type CustomOption = 'EVERY_N_DAYS' | 'EVERY_N_WEEKS' | 'EVERY_N_MONTHS' | 'SPECIFIC_DAYS';

/** 집안일 생성(등록) 요청 DTO */
export interface CreateChoreDto {
  groupId: number;
  title: string;
  category: ChoreCategory;
  assigneeId: number;
  startDate: string;
  dueDate?: string;
  repeatType: RepeatType;
  repeatDays?: DayOfWeek[];
  memo?: string;
}

/** 집안일 수정 요청 DTO */
export interface UpdateChoreDto {
  title: string;
  category: ChoreCategory;
  assigneeId: number;
  startDate: string;
  dueDate?: string;
  repeatType: RepeatType;
  repeatDays?: DayOfWeek[];
  memo?: string;
}

/** 집안일 메신저 공유 DTO */
export interface ShareChoreDto {
  chatRoomId: number;
  content?: string;
}

/** 목록 필터 */
export interface ChoreFilter {
  groupId?: number;
  status?: string;
  assigneeId?: string | number;
  keyword?: string;
  repeatType?: RepeatType;
}

/** API 요청 파라미터 (GET 통신용) */
export interface GetChoresParams {
  groupId: number;
  status?: ChoreStatus;
  assigneeId?: number;
}
