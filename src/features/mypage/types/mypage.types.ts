export type ThemeValue = 'light' | 'dark';
export type LanguageValue = 'ko' | 'en';
export type TimezoneValue = 'seoul';
export type StartDayValue = 'sunday' | 'monday';
export type DateFormatValue = 'YYYY/MM/DD' | 'DD/MM/YY';
export type FontSizeValue = 'large' | 'normal' | 'small';

export type NotificationType =
  | 'CHORE_DEADLINE'
  | 'SHARED_ITEM_CHANGE'
  | 'MESSENGER_MESSAGE'
  | 'SETTLEMENT_REQUEST'
  | 'RULE_AGREEMENT_REQUEST'
  | 'GROUP_ACTIVITY_ALL';


export interface UpdateProfileDto {
  name: string;
  nickname: string;
  profileImage: string | null;
}

export interface UploadUrlRequestDto {
  contentType: string;
  fileSize: number;
}

export interface UploadUrlResponse {
  uploadMethod: string;
  uploadUrl: string;
  fields: Record<string, string>;
  objectKey: string;
  profileImageUrl: string;
  expiresAt: string;
}

export interface NotificationPreferencesDto {
  choreDue: boolean;
  supplyStatusChanged: boolean;
  newMessage: boolean;
  expenseRequest: boolean;
  ruleAgreementRequest: boolean;
  groupActivity: boolean;
}