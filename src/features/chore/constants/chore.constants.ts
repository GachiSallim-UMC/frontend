import type { RepeatType, ChoreCategory, DayOfWeek } from '../types/chore.types';

//카테고리 옵션
export const CATEGORY_OPTIONS: { value: ChoreCategory; label: string }[] = [
  { value: 'cleaning', label: '청소' },
  { value: 'dishes', label: '설거지' },
  { value: 'laundry', label: '세탁' },
  { value: 'trash', label: '쓰레기/분리수거' },
  { value: 'organizing', label: '정리정돈' },
  { value: 'shopping', label: '장보기/물품관리' },
  { value: 'cooking', label: '요리/식사' },
  { value: 'pets_plants', label: '반려동물/식물' },
  { value: 'etc', label: '기타' },
];

//반복 유형 옵션
export const REPEAT_TYPE_OPTIONS: { value: RepeatType; label: string }[] = [
  { value: 'once', label: '반복 없음' },
  { value: 'daily', label: '매일' },
  { value: 'weekly', label: '매주' },
  { value: 'monthly', label: '매월' },
  { value: 'custom', label: '사용자 지정' },
];

//사용자 지정 상세 옵션
export const CUSTOM_OPTIONS = [
  { value: 'every_n_days', label: 'N일마다' },
  { value: 'every_n_weeks', label: 'N주마다' },
  { value: 'every_n_months', label: 'N개월마다' },
  { value: 'specific_days', label: '특정 요일 반복' },
];

//N주, N개월 배열 자동 생성
export const WEEK_OPTIONS = Array.from({ length: 4 }, (_, i) => ({
  value: String(i + 1),
  label: `${i + 1}주마다`,
}));
export const MONTH_OPTIONS = Array.from({ length: 12 }, (_, i) => ({
  value: String(i + 1),
  label: `${i + 1}개월마다`,
}));

//요일 상수
export const DAYS: { value: DayOfWeek; label: string }[] = [
  { value: 'mon', label: '월' },
  { value: 'tue', label: '화' },
  { value: 'wed', label: '수' },
  { value: 'thu', label: '목' },
  { value: 'fri', label: '금' },
  { value: 'sat', label: '토' },
  { value: 'sun', label: '일' },
];
