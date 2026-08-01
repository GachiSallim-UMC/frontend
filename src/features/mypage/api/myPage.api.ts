import { apiClient, ApiError } from '@/shared/api';
import type { 
  UpdateProfileDto, 
  UploadUrlRequestDto, 
  UploadUrlResponse, 
  NotificationPreferencesDto 
} from '../types/mypage.types';
import type { MeResponsePayload } from '@/features/auth/types/auth.type';

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const isMeResponsePayload = (value: unknown): value is MeResponsePayload =>
  isRecord(value) &&
  (typeof value.userId === 'string' || typeof value.userId === 'number') &&
  typeof value.name === 'string' &&
  typeof value.nickname === 'string' &&
  typeof value.email === 'string' &&
  (value.profileImage === undefined ||
    value.profileImage === null ||
    typeof value.profileImage === 'string');


export const myPageApi = {
  me: async (accessToken?: string): Promise<MeResponsePayload> => {
      const { data } = await apiClient.get<MeResponsePayload>(`auth/me`, {
        headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined,
      });
      if (!isMeResponsePayload(data)) {
        throw new ApiError(502, 'INVALID_API_RESPONSE', '계정 정보 응답 형식이 올바르지 않습니다.');
      }
      return data;
    },
    
  updateProfile: async (dto: UpdateProfileDto) => {
    const { data } = await apiClient.patch('/auth/profile', dto); // BASE 의존 없이 직접 작성
    return data.data;
  },
  getUploadUrl: async (dto: UploadUrlRequestDto): Promise<UploadUrlResponse> => {
    const { data } = await apiClient.post('/auth/profile-image/upload-url', dto);
    return data.data;
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

  changePassword: async (previousPassword: string, newPassword: string) => {
    const payload = { previousPassword, newPassword };
    const { data } = await apiClient.post('/auth/password/change', payload);
    return data;
  },
  withdraw: async () => {
    const { data } = await apiClient.delete('/auth/me');
    return data;
  },

  getNotificationPreferences: async (): Promise<NotificationPreferencesDto> => {
    const { data } = await apiClient.get('/notifications/preferences');
    return data;
  },
  updateNotificationPreferences: async (payload: NotificationPreferencesDto): Promise<NotificationPreferencesDto> => {
    const { data } = await apiClient.patch('/notifications/preferences', payload);
    return data;
  },
};