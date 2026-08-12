import { useEffect, useState, type ChangeEvent } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { profileImageApi } from '@/shared/api';
import { invalidateProfilePresentationQueries } from '@/shared/lib';
import { NICKNAME_PATTERN, NICKNAME_PATTERN_MESSAGE } from '@/shared/lib/inputValidation';
import { useAlertStore, useAuthStore } from '@/shared/store';
import type { AccountProfile } from '@/shared/types';
import { AVATAR_ID_TO_URL } from '@/features/mypage/constants/avatars';
import { myPageApi } from '@/features/mypage/api/myPage.api';

type ProfileField = 'name' | 'nickname';
type ProfileErrors = Partial<Record<ProfileField, string>>;

const PROFILE_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const PROFILE_IMAGE_MAX_SIZE = 5 * 1024 * 1024;

export const useProfileBasicInfo = () => {
  const userId = useAuthStore(state => state.userId);
  const accessToken = useAuthStore(state => state.accessToken);
  const showAlert = useAlertStore(state => state.showAlert);
  const queryClient = useQueryClient();
  const [name, setName] = useState('');
  const [nickname, setNickname] = useState('');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<ProfileErrors>({});
  const [isSaving, setIsSaving] = useState(false);

  const profileQuery = useQuery({
    queryKey: ['auth', 'me', userId],
    queryFn: () => myPageApi.me(),
    enabled: Boolean(accessToken && userId),
  });

  useEffect(() => {
    if (!profileQuery.data) return;
    setName(profileQuery.data.name);
    setNickname(profileQuery.data.nickname);
    setProfileImage(profileQuery.data.profileImage ?? null);
    setEmail(profileQuery.data.email);
  }, [profileQuery.data]);

  const syncUpdatedProfile = async (updatedProfile: AccountProfile) => {
    // 공통 헤더는 같은 auth/me 캐시를 사용하므로 응답값을 즉시 반영합니다.
    queryClient.setQueryData(['auth', 'me', userId], updatedProfile);
    await invalidateProfilePresentationQueries(queryClient);
  };

  const clearFieldError = (field: ProfileField) => {
    setErrors(previous => ({ ...previous, [field]: undefined }));
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!PROFILE_IMAGE_TYPES.includes(file.type)) {
      showAlert({
        title: '지원하지 않는 파일 형식',
        message: 'JPG, PNG 또는 WebP 형식의 이미지만 업로드할 수 있습니다.',
      });
      event.target.value = '';
      return;
    }

    if (file.size < 1 || file.size > PROFILE_IMAGE_MAX_SIZE) {
      showAlert({
        title: '파일 용량 초과',
        message: '이미지 크기는 5MB 이하로 선택해 주세요.',
      });
      event.target.value = '';
      return;
    }

    try {
      setIsSaving(true);
      const upload = await profileImageApi.getUploadUrl({
        contentType: file.type,
        fileSize: file.size,
      });
      const finalImageUrl = await profileImageApi.uploadToS3(upload, file);
      const updatedProfile = await myPageApi.updateProfile({ profileImage: finalImageUrl });
      setProfileImage(updatedProfile.profileImage ?? null);
      await syncUpdatedProfile(updatedProfile);
    } catch {
      showAlert({
        title: '업로드 실패',
        message: '이미지 업로드 중 오류가 발생했습니다. 다시 시도해 주세요.',
      });
    } finally {
      setIsSaving(false);
      event.target.value = '';
    }
  };

  const saveAvatar = async (selectedAvatarId: string) => {
    const avatarUrl = AVATAR_ID_TO_URL[selectedAvatarId];
    if (!avatarUrl) return;

    try {
      setIsSaving(true);
      const updatedProfile = await myPageApi.updateProfile({ profileImage: avatarUrl });
      setProfileImage(updatedProfile.profileImage ?? null);
      await syncUpdatedProfile(updatedProfile);
    } catch {
      showAlert({
        title: '저장 실패',
        message: '아바타 변경 중 오류가 발생했습니다. 다시 시도해 주세요.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const deleteProfileImage = async () => {
    try {
      setIsSaving(true);
      const updatedProfile = await myPageApi.updateProfile({ profileImage: null });
      setProfileImage(updatedProfile.profileImage ?? null);
      await syncUpdatedProfile(updatedProfile);
    } catch {
      showAlert({
        title: '삭제 실패',
        message: '프로필 이미지 삭제 중 오류가 발생했습니다. 다시 시도해 주세요.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const saveProfile = async () => {
    const nextErrors: ProfileErrors = {};
    const trimmedName = name.trim();
    const trimmedNickname = nickname.trim();

    if (!trimmedName) nextErrors.name = '이름을 입력해 주세요.';
    else if (trimmedName.length > 30) nextErrors.name = '이름은 30자 이하로 입력해 주세요.';

    if (!trimmedNickname) nextErrors.nickname = '닉네임을 입력해 주세요.';
    else if (trimmedNickname.length < 2 || trimmedNickname.length > 10) {
      nextErrors.nickname = '닉네임은 2자 이상 10자 이하로 입력해 주세요.';
    } else if (!NICKNAME_PATTERN.test(trimmedNickname)) {
      nextErrors.nickname = NICKNAME_PATTERN_MESSAGE;
    }

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return false;

    try {
      setIsSaving(true);
      const updatedProfile = await myPageApi.updateProfile({
        name: trimmedName,
        nickname: trimmedNickname,
        profileImage,
      });
      setName(updatedProfile.name);
      setNickname(updatedProfile.nickname);
      setProfileImage(updatedProfile.profileImage ?? null);
      await syncUpdatedProfile(updatedProfile);
      return true;
    } catch {
      showAlert({
        title: '저장 실패',
        message: '프로필 저장 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.',
      });
      return false;
    } finally {
      setIsSaving(false);
    }
  };

  return {
    name,
    setName,
    nickname,
    setNickname,
    profileImage,
    email,
    errors,
    clearFieldError,
    isSaving,
    profile: profileQuery.data,
    isProfileLoading: profileQuery.isLoading,
    isProfileError: profileQuery.isError,
    isProfileFetching: profileQuery.isFetching,
    refetchProfile: profileQuery.refetch,
    handleFileChange,
    saveAvatar,
    deleteProfileImage,
    saveProfile,
  };
};
