import { ApiError, apiClient } from '@/shared/api';
import type { 
  LoginDto, 
  LoginResponsePayload, 
  MeResponsePayload,
  SignupDto,
  SignupConfirmDto } from '../types/auth.type';

const BASE = '/auth';

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const isLoginResponsePayload = (value: unknown): value is LoginResponsePayload =>
  isRecord(value) &&
  typeof value.accessToken === 'string' &&
  value.accessToken.length > 0 &&
  typeof value.idToken === 'string' &&
  value.idToken.length > 0 &&
  typeof value.refreshToken === 'string' &&
  value.refreshToken.length > 0 &&
  typeof value.expiresIn === 'number' &&
  Number.isFinite(value.expiresIn) &&
  value.expiresIn > 0 &&
  typeof value.tokenType === 'string';

const isMeResponsePayload = (value: unknown): value is MeResponsePayload =>
  isRecord(value) &&
  (typeof value.userId === 'string' || typeof value.userId === 'number') &&
  typeof value.name === 'string' &&
  typeof value.nickname === 'string' &&
  typeof value.email === 'string' &&
  (value.profileImage === undefined ||
    value.profileImage === null ||
    typeof value.profileImage === 'string');

export const authApi = {
  login: async (dto: LoginDto): Promise<LoginResponsePayload> => {
    const { data } = await apiClient.post<LoginResponsePayload>(`${BASE}/login`, dto);
    if (!isLoginResponsePayload(data)) {
      throw new ApiError(502, 'INVALID_API_RESPONSE', '로그인 응답 형식이 올바르지 않습니다.');
    }
    return data;
  },
  me: async (accessToken?: string): Promise<MeResponsePayload> => {
    const { data } = await apiClient.get<MeResponsePayload>(`${BASE}/me`, {
      headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined,
    });
    if (!isMeResponsePayload(data)) {
      throw new ApiError(502, 'INVALID_API_RESPONSE', '계정 정보 응답 형식이 올바르지 않습니다.');
    }
    return data;
  },
  logout: async (): Promise<void> => {
    await apiClient.post(`${BASE}/logout`);
  },
  signup: async (dto: SignupDto): Promise<void> => {
    await apiClient.post(`${BASE}/signup`, dto);
  },
  signupConfirm: async (dto: SignupConfirmDto): Promise<void> => {
    await apiClient.post(`${BASE}/signup/confirm`, dto);
  },
};
