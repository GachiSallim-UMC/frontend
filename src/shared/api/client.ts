import axios from 'axios';

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

// 요청 인터셉터 — 인증 토큰 주입
apiClient.interceptors.request.use(config => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 응답 인터셉터 — 공통 에러 처리
apiClient.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // TODO: 토큰 만료 처리 (리프레시 또는 로그아웃)
    }
    return Promise.reject(error);
  },
);
