export type Status = 'done' | 'pending' | 'scheduled';
export type ExpenseStatus = 'paid' | 'unpaid';
export type ItemStatus = 'enough' | 'short' | 'empty';
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
