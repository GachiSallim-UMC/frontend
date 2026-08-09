import axios from 'axios';
import type { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import type { ApiResponse } from '@/shared/types';
import { useAuthStore } from '@/shared/store/useAuthStore';
import { useGroupStore } from '@/shared/store/useGroupStore';
import { ApiError } from './ApiError';
import { isApiResponse, unwrapApiResponse } from './response';

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
  _authSessionVersion?: number;
}

interface RefreshTokenPayload {
  accessToken: string;
  idToken: string;
  expiresIn: number;
  tokenType: string;
}

interface RefreshSessionSnapshot {
  sessionVersion: number;
  refreshToken: string;
}

interface RefreshTask extends RefreshSessionSnapshot {
  promise: Promise<string | null>;
}

const TOKEN_REFRESH_BUFFER_MS = 30_000;
const PUBLIC_AUTH_PATHS = ['/auth/login', '/auth/token/refresh'];

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api/v1',
  timeout: 10_000,
  headers: {
    'Content-Type': 'application/json',
  },
});

const clearClientSession = (expectedSessionVersion?: number): boolean => {
  const authState = useAuthStore.getState();
  if (expectedSessionVersion !== undefined && authState.sessionVersion !== expectedSessionVersion) {
    return false;
  }

  authState.clearSession();
  useGroupStore.getState().clearSelectedGroup();
  return true;
};

const isPublicAuthRequest = (url?: string) =>
  Boolean(url && PUBLIC_AUTH_PATHS.some(path => url.endsWith(path)));

const readJwtExpiration = (token: string): number | null => {
  try {
    const payload = token.split('.')[1];
    if (!payload) return null;

    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=');
    const parsed = JSON.parse(atob(padded)) as { exp?: unknown };
    return typeof parsed.exp === 'number' ? parsed.exp * 1000 : null;
  } catch {
    return null;
  }
};

const shouldRefreshAccessToken = (accessToken: string, expiresAt: number | null) => {
  const expiration = expiresAt ?? readJwtExpiration(accessToken);
  return expiration !== null && expiration <= Date.now() + TOKEN_REFRESH_BUFFER_MS;
};

const isRefreshTokenPayload = (value: unknown): value is RefreshTokenPayload => {
  if (typeof value !== 'object' || value === null) return false;

  const payload = value as Record<string, unknown>;
  return (
    typeof payload.accessToken === 'string' &&
    payload.accessToken.length > 0 &&
    typeof payload.idToken === 'string' &&
    payload.idToken.length > 0 &&
    typeof payload.expiresIn === 'number' &&
    Number.isFinite(payload.expiresIn) &&
    payload.expiresIn > 0 &&
    typeof payload.tokenType === 'string'
  );
};

const getDirectErrorMessage = (body: unknown): string | undefined => {
  if (typeof body !== 'object' || body === null || !('message' in body)) return undefined;

  const message = (body as { message?: unknown }).message;
  if (typeof message === 'string') return message;
  if (Array.isArray(message) && message.every(item => typeof item === 'string')) {
    return message.join(', ');
  }
  return undefined;
};

const getDirectErrorCode = (body: unknown): string | undefined => {
  if (typeof body !== 'object' || body === null) return undefined;

  const candidate = body as { code?: unknown; errorCode?: unknown };
  if (typeof candidate.code === 'string') return candidate.code;
  if (typeof candidate.errorCode === 'string') return candidate.errorCode;
  return undefined;
};

const toApiError = (error: unknown): ApiError => {
  if (error instanceof ApiError) return error;

  if (!axios.isAxiosError(error)) {
    return new ApiError(0, 'NETWORK_ERROR');
  }

  const response = error.response;
  if (!response) return new ApiError(0, 'NETWORK_ERROR');

  const body = response.data;
  if (isApiResponse(body) && body.error) {
    return new ApiError(body.statusCode, body.error.code, body.error.message, body.error.errors);
  }

  const statusCode = response.status;
  const code =
    getDirectErrorCode(body) ??
    (statusCode === 401 ? 'AUTH_SESSION_EXPIRED' : `HTTP_${statusCode}`);
  return new ApiError(statusCode, code, getDirectErrorMessage(body));
};

const isTerminalRefreshError = (error: ApiError) => error.statusCode === 401;

const refreshAccessToken = async (snapshot: RefreshSessionSnapshot): Promise<string | null> => {
  try {
    const response = await axios.post<ApiResponse<RefreshTokenPayload> | RefreshTokenPayload>(
      `${apiClient.defaults.baseURL}/auth/token/refresh`,
      { refreshToken: snapshot.refreshToken },
      { timeout: apiClient.defaults.timeout },
    );
    const tokens = unwrapApiResponse<RefreshTokenPayload>(response.data);

    if (!isRefreshTokenPayload(tokens)) {
      throw new ApiError(502, 'INVALID_API_RESPONSE', '토큰 갱신 응답 형식이 올바르지 않습니다.');
    }

    const updated = useAuthStore.getState().updateTokens(tokens, snapshot);
    return updated ? tokens.accessToken : null;
  } catch (error) {
    throw toApiError(error);
  }
};

let refreshTask: RefreshTask | null = null;

const getRefreshedAccessToken = (): Promise<string | null> => {
  const { refreshToken, sessionVersion } = useAuthStore.getState();
  if (!refreshToken) return Promise.resolve(null);

  if (refreshTask?.sessionVersion === sessionVersion && refreshTask.refreshToken === refreshToken) {
    return refreshTask.promise;
  }

  const snapshot = { refreshToken, sessionVersion };
  const task: RefreshTask = { ...snapshot, promise: Promise.resolve(null) };
  task.promise = refreshAccessToken(snapshot).finally(() => {
    if (refreshTask === task) refreshTask = null;
  });
  refreshTask = task;
  return task.promise;
};

const retryRequestWithRefreshedToken = async (
  config: RetryableRequestConfig,
  expectedSessionVersion: number | undefined,
  suppressNonTerminalRefreshError = false,
): Promise<AxiosResponse | undefined> => {
  config._retry = true;

  try {
    const newAccessToken = await getRefreshedAccessToken();
    if (!newAccessToken) return undefined;

    config.headers.Authorization = `Bearer ${newAccessToken}`;
    return apiClient(config);
  } catch (refreshError) {
    const normalizedRefreshError = toApiError(refreshError);
    if (isTerminalRefreshError(normalizedRefreshError)) {
      clearClientSession(expectedSessionVersion);
      throw new ApiError(401, 'AUTH_SESSION_EXPIRED');
    }
    if (!suppressNonTerminalRefreshError) throw normalizedRefreshError;
    return undefined;
  }
};

apiClient.interceptors.request.use(async config => {
  const requestConfig = config as RetryableRequestConfig;
  const isPublicRequest = isPublicAuthRequest(config.url);
  const hasExplicitAuthorization = Boolean(config.headers.Authorization);
  const authState = useAuthStore.getState();

  if (!isPublicRequest && !hasExplicitAuthorization) {
    const { accessToken, accessTokenExpiresAt, refreshToken, sessionVersion } = authState;
    let requestAccessToken = accessToken;
    requestConfig._authSessionVersion = sessionVersion;

    if (accessToken && shouldRefreshAccessToken(accessToken, accessTokenExpiresAt)) {
      if (!refreshToken) {
        clearClientSession(sessionVersion);
        throw new ApiError(401, 'AUTH_SESSION_EXPIRED');
      }

      try {
        requestAccessToken = await getRefreshedAccessToken();
        if (!requestAccessToken) throw new ApiError(401, 'AUTH_SESSION_EXPIRED');
      } catch (error) {
        const refreshError = toApiError(error);
        if (isTerminalRefreshError(refreshError)) {
          clearClientSession(sessionVersion);
          throw new ApiError(401, 'AUTH_SESSION_EXPIRED');
        }
        throw refreshError;
      }
    }

    if (requestAccessToken) {
      config.headers.Authorization = `Bearer ${requestAccessToken}`;
    }
  } else if (
    !isPublicRequest &&
    authState.accessToken &&
    config.headers.Authorization === `Bearer ${authState.accessToken}`
  ) {
    requestConfig._authSessionVersion = authState.sessionVersion;
  }

  if (!isPublicRequest && authState.userId) {
    config.headers['x-user-id'] = authState.userId;
  }

  return config;
});

apiClient.interceptors.response.use(
  response => {
    response.data = unwrapApiResponse(response.data);
    return response;
  },
  async (error: AxiosError<unknown>) => {
    const config = error.config as RetryableRequestConfig | undefined;
    const apiError = toApiError(error);
    const expectedSessionVersion = config?._authSessionVersion;
    const isCurrentSession =
      expectedSessionVersion !== undefined &&
      useAuthStore.getState().sessionVersion === expectedSessionVersion;
    const canRefresh =
      apiError.statusCode === 401 &&
      Boolean(config) &&
      !config?._retry &&
      !isPublicAuthRequest(config?.url) &&
      isCurrentSession;

    if (canRefresh && config) {
      const retryResponse = await retryRequestWithRefreshedToken(config, expectedSessionVersion);
      if (retryResponse) return retryResponse;
    }

    // 일부 게이트웨이는 401 응답에 CORS 헤더를 붙이지 않아 브라우저가 status를 숨깁니다.
    // 현재 세션의 인증 요청에만 한 번 갱신을 시도하고 실제 네트워크 장애라면 세션을 유지합니다.
    if (
      apiError.code === 'NETWORK_ERROR' &&
      config &&
      !config._retry &&
      isCurrentSession &&
      Boolean(config.headers.Authorization) &&
      Boolean(useAuthStore.getState().refreshToken)
    ) {
      const retryResponse = await retryRequestWithRefreshedToken(
        config,
        expectedSessionVersion,
        true,
      );
      if (retryResponse) return retryResponse;
    }

    if (apiError.statusCode === 401 && isCurrentSession) {
      clearClientSession(expectedSessionVersion);
    }

    return Promise.reject(apiError);
  },
);
