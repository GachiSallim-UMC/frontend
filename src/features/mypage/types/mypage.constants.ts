import type { SelectOption, CheckboxOption } from '@/shared/components'
import type {
  DateFormatValue,
  FontSizeValue,
  LanguageValue,
  StartDayValue,
  ThemeValue,
  TimezoneValue,
  NotificationType
} from '@/features/mypage/types/mypage.types'

export const THEME_OPTIONS: SelectOption<ThemeValue>[] = [
  { value: 'light', label: '라이트 모드' },
  { value: 'dark', label: '다크 모드' },
];

export const LANGUAGE_OPTIONS: SelectOption<LanguageValue>[] = [
  { value: 'ko', label: '한국어' },
  { value: 'en', label: 'English' },
];

export const TIMEZONE_OPTIONS: SelectOption<TimezoneValue>[] = [
  { value: 'seoul', label: '(GMT+9) 서울' },
];

export const START_DAY_OPTIONS: SelectOption<StartDayValue>[] = [
  { value: 'sunday', label: '일요일' },
  { value: 'monday', label: '월요일' },
];

export const DATE_FORMAT_OPTIONS: SelectOption<DateFormatValue>[] = [
  { value: 'YYYY/MM/DD', label: 'YYYY/MM/DD' },
  { value: 'DD/MM/YY', label: 'DD/MM/YY' },
];

export const FONT_SIZE_OPTIONS: SelectOption<FontSizeValue>[] = [
  { value: 'large', label: '크게' },
  { value: 'normal', label: '보통' },
  { value: 'small', label: '작게' },
];

export const NOTIFICATION_LEFT_OPTIONS: CheckboxOption<NotificationType>[] = [
  { value: 'CHORE_DEADLINE', label: '집안일 기한 알림' },
  { value: 'SHARED_ITEM_CHANGE', label: '공용 물품 상태 변경 알림' },
  { value: 'MESSENGER_MESSAGE', label: '메신저 메시지 알림' },
];

export const NOTIFICATION_RIGHT_OPTIONS: CheckboxOption<NotificationType>[] = [
  { value: 'SETTLEMENT_REQUEST', label: '정산 요청 알림' },
  { value: 'RULE_AGREEMENT_REQUEST', label: '생활 규칙 동의 요청 알림' },
  { value: 'GROUP_ACTIVITY_ALL', label: '그룹 활동 전체 알림' },
];