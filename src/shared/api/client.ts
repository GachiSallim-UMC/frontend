import axios from 'axios';
import type { AxiosError, InternalAxiosRequestConfig } from 'axios';
import type { ApiResponse } from '@/shared/types';
import { ApiError } from './ApiError';
import { clearAuthSession, getAccessToken, getRefreshToken, getUserId, setAuthTokens } from './authStorage';

interface RetryableRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

interface RefreshTokenPayload {
  accessToken: string;
  idToken: string;
  expiresIn: number;
  tokenType: string;
}

/**
 * 공통 Axios 인스턴스.
 * baseURL은 환경변수(VITE_API_BASE_URL)로 주입합니다.
 */
export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api',
  timeout: 10_000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터 — 인증 토큰 및 사용자 ID 주입
apiClient.interceptors.request.use(config => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  const userId = getUserId();
  if (userId) {
    config.headers['x-user-id'] = userId;
  }
  return config;
});

let refreshPromise: Promise<string | null> | null = null;

// Cognito refresh token으로 새 access token을 발급받음.
// apiClient가 아닌 axios를 직접 써서, 이 요청 자체가 이 인터셉터를 다시 타는 것을 방지함.
const refreshAccessToken = async (): Promise<string | null> => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) {
    return null;
  }

  const response = await axios.post<ApiResponse<RefreshTokenPayload>>(
    `${apiClient.defaults.baseURL}/auth/token/refresh`,
    { refreshToken },
  );
  const tokens = response.data.data;
  setAuthTokens({ accessToken: tokens.accessToken, idToken: tokens.idToken });
  return tokens.accessToken;
};

// 응답 인터셉터 — 성공 응답 언래핑 + 401 리프레시 재시도 + 에러 정규화
apiClient.interceptors.response.use(
  response => {
    response.data = response.data?.data;
    return response;
  },
  async (error: AxiosError<ApiResponse<never>>) => {
    const config = error.config as RetryableRequestConfig | undefined;
    const response = error.response;

    if (response?.status === 401 && config && !config._retry) {
      config._retry = true;
      try {
        refreshPromise ??= refreshAccessToken().finally(() => {
          refreshPromise = null;
        });
        const newAccessToken = await refreshPromise;
        if (newAccessToken) {
          return apiClient(config);
        }
      } catch {
        // 리프레시 실패 — 아래에서 세션 정리 후 에러로 처리
      }
      clearAuthSession();
    }

    const body = response?.data;
    if (body?.error) {
      return Promise.reject(new ApiError(body.statusCode, body.error.code, body.error.message, body.error.errors));
    }
    return Promise.reject(error);
  },
);
