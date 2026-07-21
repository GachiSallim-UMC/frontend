import type { ErrorDetail } from '@/shared/types';

export class ApiError extends Error {
  readonly statusCode: number;
  readonly code: string;
  readonly errors?: ErrorDetail[];

  constructor(statusCode: number, code: string, message: string, errors?: ErrorDetail[]) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.code = code;
    this.errors = errors;
  }
}
