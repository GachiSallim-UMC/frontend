import { apiClient, ApiError } from '@/shared/api';
import type { UpdateProfileDto, NotificationPreferencesDto } from '../types/mypage.types';
import { isAccountProfile, type AccountProfile } from '@/shared/types';

const extractFilename = (contentDisposition?: string): string | null => {
  if (!contentDisposition) return null;
  const match = contentDisposition.match(/filename\*?=(?:UTF-8'')?"?([^";]+)"?/i);
  return match ? decodeURIComponent(match[1]) : null;
};

const todayDateString = () => new Date().toISOString().slice(0, 10);

export const myPageApi = {
  me: async (): Promise<AccountProfile> => {
    const { data } = await apiClient.get<AccountProfile>('/auth/me');
    if (!isAccountProfile(data)) {
      throw new ApiError(502, 'INVALID_API_RESPONSE', '계정 정보 응답 형식이 올바르지 않습니다.');
    }
    return data;
  },

  updateProfile: async (dto: UpdateProfileDto): Promise<AccountProfile> => {
    const { data } = await apiClient.patch<AccountProfile>('/auth/profile', dto);
    if (!isAccountProfile(data)) {
      throw new ApiError(502, 'INVALID_API_RESPONSE', '계정 정보 응답 형식이 올바르지 않습니다.');
    }
    return data;
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

  // 내 데이터 내보내기 (UTF-8 BOM 포함 CSV)
  exportMyData: async (): Promise<{ blob: Blob; filename: string }> => {
    const response = await apiClient.get<Blob>('/auth/me/data-export', {
      responseType: 'blob',
      headers: { Accept: 'text/csv' },
    });

    const filename =
      extractFilename(response.headers['content-disposition']) ??
      `gachisallim-my-data-${todayDateString()}.csv`;

    return { blob: response.data, filename };
  },

  getNotificationPreferences: async (): Promise<NotificationPreferencesDto> => {
    const { data } = await apiClient.get('/notifications/preferences');
    return data;
  },
  updateNotificationPreferences: async (
    payload: NotificationPreferencesDto,
  ): Promise<NotificationPreferencesDto> => {
    const { data } = await apiClient.patch('/notifications/preferences', payload);
    return data;
  },
};
