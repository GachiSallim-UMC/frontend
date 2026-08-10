import { apiClient } from './client';
import { ApiError } from './ApiError';

interface ProfileImageUploadRequest {
  contentType: string;
  fileSize: number;
}

interface ProfileImageUploadResponse {
  uploadMethod: string;
  uploadUrl: string;
  fields: Record<string, string>;
  objectKey: string;
  profileImageUrl: string;
  expiresAt: string;
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const isStringRecord = (value: unknown): value is Record<string, string> =>
  isRecord(value) && Object.values(value).every(item => typeof item === 'string');

const isProfileImageUploadResponse = (value: unknown): value is ProfileImageUploadResponse =>
  isRecord(value) &&
  typeof value.uploadMethod === 'string' &&
  typeof value.uploadUrl === 'string' &&
  isStringRecord(value.fields) &&
  typeof value.objectKey === 'string' &&
  typeof value.profileImageUrl === 'string' &&
  typeof value.expiresAt === 'string';

export const profileImageApi = {
  getUploadUrl: async (request: ProfileImageUploadRequest): Promise<ProfileImageUploadResponse> => {
    const { data } = await apiClient.post('/auth/profile-image/upload-url', request);
    if (!isProfileImageUploadResponse(data)) {
      throw new ApiError(
        502,
        'INVALID_API_RESPONSE',
        '이미지 업로드 응답 형식이 올바르지 않습니다.',
      );
    }
    return data;
  },

  uploadToS3: async (upload: ProfileImageUploadResponse, file: File): Promise<string> => {
    const formData = new FormData();
    Object.entries(upload.fields).forEach(([key, value]) => formData.append(key, value));
    formData.append('file', file);

    const response = await fetch(upload.uploadUrl, {
      method: upload.uploadMethod,
      body: formData,
    });

    if (!response.ok) {
      throw new Error('S3 이미지 업로드에 실패했습니다.');
    }

    return upload.profileImageUrl;
  },
};
