export type Status = 'done' | 'pending' | 'scheduled';
export type StartDayValue = 'sunday' | 'monday';
export type DateFormatValue = 'YYYY/MM/DD' | 'DD/MM/YY';
export type ExpenseStatus = 'paid' | 'unpaid';
export type ItemStatus = 'enough' | 'short' | 'empty' | 'purchased';
export type RuleStatus = 'active' | 'inactive';

export interface User {
  id: string;
  name: string;
  nickname: string;
  email: string;
  avatarUrl?: string;
}

export interface PaginationMeta {
  page: number;
  size: number;
  total: number;
}

export interface ErrorDetail {
  field: string;
  value: unknown;
  reason: string;
}

/** S3 presigned URL 방식 파일 업로드 요청/응답 (프로필·그룹 이미지 등 여러 도메인에서 공용으로 사용) */
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

export interface ApiSuccessResponse<T> {
  statusCode: number;
  data: T;
  error: null;
}

export interface ApiErrorResponse {
  statusCode: number;
  data: null;
  error: {
    code: string;
    message: string;
    errors?: ErrorDetail[];
  };
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;
