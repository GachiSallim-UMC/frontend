export { apiClient } from './client';
export { ApiError, isUnexpectedApiError } from './ApiError';
export {
  BACKEND_ERROR_DEFINITIONS,
  CLIENT_ERROR_DEFINITIONS,
  getApiErrorFallbackMessage,
  getApiErrorTitle,
  isBackendErrorCode,
  isClientErrorCode,
} from './errorCodes';
export type { BackendErrorCode, ClientErrorCode, KnownApiErrorCode } from './errorCodes';
export { isApiResponse, unwrapApiResponse } from './response';
export { requireSelectedGroupId, withSelectedGroupBody, withSelectedGroupParams } from './groupContext';
