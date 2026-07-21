import type { ApiResponse } from '@/shared/types';
import { ApiError } from './ApiError';

export const isApiResponse = (value: unknown): value is ApiResponse<unknown> => {
  if (typeof value !== 'object' || value === null) return false;

  const candidate = value as Record<string, unknown>;
  const error = candidate.error;
  const hasValidError =
    error === null ||
    (typeof error === 'object' &&
      error !== null &&
      typeof (error as Record<string, unknown>).code === 'string' &&
      typeof (error as Record<string, unknown>).message === 'string');

  return (
    typeof candidate.statusCode === 'number' &&
    'data' in candidate &&
    'error' in candidate &&
    hasValidError
  );
};

const looksLikeApiResponse = (value: unknown): boolean =>
  typeof value === 'object' &&
  value !== null &&
  'statusCode' in value &&
  'data' in value &&
  'error' in value;

/** Swagger의 직접 응답과 런타임 공통 래핑 응답을 모두 허용합니다. */
export const unwrapApiResponse = <T>(value: unknown): T => {
  if (!isApiResponse(value)) {
    if (looksLikeApiResponse(value)) {
      throw new ApiError(502, 'INVALID_API_RESPONSE', '공통 API 응답 형식이 올바르지 않습니다.');
    }
    return value as T;
  }

  if (value.error) {
    throw new ApiError(
      value.statusCode,
      value.error.code,
      value.error.message,
      value.error.errors,
    );
  }

  return value.data as T;
};
