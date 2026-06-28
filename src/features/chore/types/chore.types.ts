import type { Status, User } from '@/shared/types';

/** 집안일 카테고리 */
export type ChoreCategory = 'cleaning' | 'dishes' | 'laundry' | 'trash' | 'etc';

/** 반복 유형 */
export type RepeatType = 'once' | 'daily' | 'weekly' | 'monthly';

/** 요일 (반복 주기 설정용) */
export type DayOfWeek = 'mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun';

/** 집안일 도메인 모델 */
export interface Chore {
  id: string;
  name: string;
  assignee: User;
  category: ChoreCategory;
  repeatType: RepeatType;
  repeatDays: DayOfWeek[];
  startDate: string;
  endDate?: string;
  status: Status;
  memo?: string;
}

/** 집안일 생성 요청 DTO */
export interface CreateChoreDto {
  name: string;
  assigneeId: string;
  category: ChoreCategory;
  repeatType: RepeatType;
  repeatDays: DayOfWeek[];
  startDate: string;
  endDate?: string;
  memo?: string;
}

/** 집안일 수정 요청 DTO */
export type UpdateChoreDto = Partial<CreateChoreDto>;

/** 목록 필터 */
export interface ChoreFilter {
  status?: Status;
  assigneeId?: string;
  keyword?: string;
}
