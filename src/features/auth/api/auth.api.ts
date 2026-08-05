import { ApiError, apiClient } from '@/shared/api';
import type { 
  LoginDto, 
  LoginResponsePayload, 
  MeResponsePayload,
  SignupDto,
  SocialFormDto,
  ForgotPasswordDto,
  SignupConfirmDto,
  ResetPasswordDto } from '../types/auth.type';
import type { 
    UpdateProfileDto,
    UploadUrlRequestDto,
    UploadUrlResponse
} from '@/features/mypage/types/mypage.types'

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
  socialSignup: async (dto: SocialFormDto, accessToken: string): Promise<MeResponsePayload> => {
    const { data } = await apiClient.post<MeResponsePayload>(`${BASE}/social/signup`, dto, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    
    if (!isMeResponsePayload(data)) {
      throw new ApiError(502, 'INVALID_API_RESPONSE', '소셜 가입 응답 형식이 올바르지 않습니다.');
    }
    return data;
  },
  forgotPassword: async (dto: ForgotPasswordDto): Promise<void> => {
    await apiClient.post(`${BASE}/password/forgot`, dto);
  },
  resetPassword: async (dto: ResetPasswordDto): Promise<void> => {
    await apiClient.post(`${BASE}/password/reset`, dto);
  },
  // 프로필 정보 업데이트
  updateProfile: async (dto: UpdateProfileDto) => {
    const { data } = await apiClient.patch(`${BASE}/profile`, dto);
    return data;
  },

  // S3 업로드 URL 발급
  getUploadUrl: async (dto: UploadUrlRequestDto): Promise<UploadUrlResponse> => {
    const { data } = await apiClient.post(`${BASE}/profile-image/upload-url`, dto);
    return data;
  },

  // S3 파일 업로드
  uploadToS3: async (uploadData: UploadUrlResponse, file: File) => {
    const formData = new FormData();
        
    // 백엔드에서 준 fields 값들을 모두 폼 데이터에 추가
    Object.entries(uploadData.fields).forEach(([key, value]) => {
      formData.append(key, value);
    });
        
    formData.append('file', file);

    const response = await fetch(uploadData.uploadUrl, {
      method: uploadData.uploadMethod,
      body: formData,
    });

    if (!response.ok) {
      throw new Error('S3 이미지 업로드에 실패했습니다.');
      }

    // 성공 시 사용할 최종 이미지 URL 반환
    return uploadData.profileImageUrl;
  },

  // 비밀번호 변경(마이페이지)
  changePassword: async (previousPassword: string, newPassword: string) => {
    const payload = {
      previousPassword,
      newPassword
    };

    const { data } = await apiClient.post(`${BASE}/password/change`, payload);
    return data;
  },

  // 회원 탈퇴
  withdraw: async () => {
    const { data } = await apiClient.delete(`${BASE}/me`);
    return data;
  }
};
