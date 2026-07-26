import type {
  ChoreApiCategory as ChoreCategory,
  ChoreApiCustomOption as CustomOption,
  ChoreApiDayOfWeek as DayOfWeek,
  ChoreApiRepeatType as RepeatType,
} from '../types/chore.types';

export const CATEGORY_OPTIONS: { value: ChoreCategory; label: string }[] = [
  { value: 'CLEANING', label: '청소' },
  { value: 'DISHWASHING', label: '설거지' },
  { value: 'LAUNDRY', label: '세탁' },
  { value: 'TRASH', label: '쓰레기/분리수거' },
  { value: 'TIDYING', label: '정리정돈' },
  { value: 'SHOPPING', label: '장보기/물품관리' },
  { value: 'COOKING', label: '요리/식사' },
  { value: 'PET_PLANT', label: '반려동물/식물' },
  { value: 'ETC', label: '기타' },
];

export const REPEAT_TYPE_OPTIONS: { value: RepeatType; label: string }[] = [
  { value: 'NONE', label: '반복 없음' },
  { value: 'DAILY', label: '매일' },
  { value: 'WEEKLY', label: '매주' },
  { value: 'MONTHLY', label: '매월' },
  { value: 'CUSTOM', label: '사용자 지정' },
];

export const CUSTOM_OPTIONS: { value: CustomOption; label: string }[] = [
  { value: 'EVERY_N_DAYS', label: 'N일마다' },
  { value: 'EVERY_N_WEEKS', label: 'N주마다' },
  { value: 'EVERY_N_MONTHS', label: 'N개월마다' },
  { value: 'SPECIFIC_DAYS', label: '특정 요일 반복' },
];

export const WEEK_OPTIONS = Array.from({ length: 4 }, (_, i) => ({
  value: String(i + 1),
  label: `${i + 1}주마다`,
}));

export const MONTH_OPTIONS = Array.from({ length: 12 }, (_, i) => ({
  value: String(i + 1),
  label: `${i + 1}개월마다`,
}));

export const DAYS: { value: DayOfWeek; label: string }[] = [
  { value: 'MON', label: '월' },
  { value: 'TUE', label: '화' },
  { value: 'WED', label: '수' },
  { value: 'THU', label: '목' },
  { value: 'FRI', label: '금' },
  { value: 'SAT', label: '토' },
  { value: 'SUN', label: '일' },
];
