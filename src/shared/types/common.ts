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

export interface ApiResponse<T> {
  data: T;
  message: string;
}
