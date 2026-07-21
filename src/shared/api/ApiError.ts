import type { ErrorDetail } from '@/shared/types';
import { getApiErrorFallbackMessage } from './errorCodes';

export class ApiError extends Error {
  readonly statusCode: number;
  readonly code: string;
  readonly errors?: ErrorDetail[];

  constructor(statusCode: number, code: string, message?: string, errors?: ErrorDetail[]) {
    super(message || getApiErrorFallbackMessage(statusCode, code));
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.code = code;
    this.errors = errors;
  }
}

export const isUnexpectedApiError = (error: unknown): error is ApiError => {
  if (!(error instanceof ApiError)) return false;
  if (error.code === 'NETWORK_ERROR') return true;
  if (error.statusCode >= 500) return true;
  if (error.statusCode === 401) return true;
  if (error.statusCode === 429) return true;
  return false;
};
