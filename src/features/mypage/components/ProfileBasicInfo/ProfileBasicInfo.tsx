import { useEffect, useRef, useState } from 'react';
import { Button, BottomSheet, FormInput } from '@/shared/components';
import { AVATAR_ID_BY_URL } from '@/features/mypage/constants/avatars';
import { AvatarSelectionModal } from '@/features/mypage/components/AvatarSelectionModal/AvatarSelectionModal';
import { useProfileBasicInfo } from '@/features/mypage/hooks/useProfileBasicInfo';
import { useAlertStore } from '@/shared/store';
import CameraIcon from '@/assets/icons/mypage/camera.svg?react';
import UploadIcon from '@/assets/icons/mypage/upload.svg?react';
import TrashIcon from '@/assets/icons/mypage/trash.svg?react';
import ProfileIcon from '@/assets/icons/mypage/profile.svg?react';

export const ProfileBasicInfo = () => {
  const showAlert = useAlertStore(state => state.showAlert);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAvatarModalOpen, setIsAvatarModalOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const {
    name,
    setName,
    nickname,
    setNickname,
    profileImage,
    email,
    errors,
    clearFieldError,
    isSaving,
    profile,
    isProfileLoading,
    isProfileError,
    isProfileFetching,
    refetchProfile,
    handleFileChange,
    saveAvatar,
    deleteProfileImage,
    saveProfile,
  } = useProfileBasicInfo();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
    setIsMenuOpen(false);
  };

  const handleSelectAvatarMenu = () => {
    setIsAvatarModalOpen(true);
    setIsMenuOpen(false);
  };

  const handleConfirmAvatar = (selectedAvatarId: string) => {
    setIsAvatarModalOpen(false);
    void saveAvatar(selectedAvatarId);
  };

  const handleDeleteImage = () => {
    setIsMenuOpen(false);
    void deleteProfileImage();
  };

  const handleSave = async () => {
    if (await saveProfile()) {
      showAlert({
        title: '완료',
        message: '프로필이 성공적으로 저장되었습니다.',
        tone: 'success',
      });
    }
  };

  if (isProfileLoading) {
    return (
      <section className="flex min-h-64 w-full items-center justify-center rounded-2xl bg-white p-8">
        <span className="text-sm text-gray-500">프로필을 불러오는 중...</span>
      </section>
    );
  }

  if (isProfileError || !profile) {
    return (
      <section className="flex min-h-64 w-full flex-col items-center justify-center rounded-2xl bg-white p-8 text-center">
        <span className="text-sm text-red-700">프로필을 불러오지 못했습니다.</span>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-3"
          isLoading={isProfileFetching}
          onClick={() => void refetchProfile()}
        >
          다시 시도
        </Button>
      </section>
    );
  }

  return (
    <>
      <section className="flex w-full flex-col items-center gap-4 lg:flex-row lg:items-start lg:gap-12 lg:rounded-2xl lg:bg-white lg:p-8">
        <div className="flex shrink-0 flex-col items-center justify-center lg:pt-2">
          <div className="relative mb-2 h-[100px] w-[100px] lg:mb-4 lg:h-36 lg:w-36">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
            />

            {profileImage ? (
              <img
                src={profileImage}
                alt="프로필 이미지"
                className="h-full w-full rounded-full border border-gray-100 bg-gray-50 object-cover"
              />
            ) : (
              <div className="h-full w-full rounded-full bg-primary-400" />
            )}

            <div ref={menuRef} className="absolute bottom-0 right-0">
              <button
                type="button"
                aria-label="프로필 이미지 변경"
                onClick={() => setIsMenuOpen(previous => !previous)}
                disabled={isSaving}
                className="flex h-7 w-7 items-center justify-center rounded-full border border-gray-100 bg-white shadow-md transition-colors hover:bg-gray-100 disabled:cursor-not-allowed disabled:opacity-50 lg:h-10 lg:w-10"
              >
                <CameraIcon className="h-4 w-4 text-gray-700 lg:h-6 lg:w-6" />
              </button>

              {isMenuOpen && (
                <div className="absolute right-0 top-8 z-20 hidden w-[180px] flex-col rounded-lg bg-white py-2 shadow-lg ring-1 ring-gray-900 ring-dropdown lg:left-12 lg:right-auto lg:top-0 lg:flex">
                  <button
                    type="button"
                    onClick={handleUploadClick}
                    className="flex items-center gap-3 px-5 py-3 text-sm font-medium text-gray-900 transition-colors hover:bg-gray-100"
                  >
                    <UploadIcon />
                    사진 업로드
                  </button>
                  <button
                    type="button"
                    onClick={handleSelectAvatarMenu}
                    className="flex items-center gap-3 px-5 py-3 text-sm font-medium text-gray-900 transition-colors hover:bg-gray-100"
                  >
                    <ProfileIcon />
                    기본 아바타 선택
                  </button>
                  <button
                    type="button"
                    onClick={handleDeleteImage}
                    className="flex items-center gap-3 px-5 py-3 text-sm font-medium text-red-700 transition-colors hover:bg-red-50"
                  >
                    <TrashIcon />
                    사진 삭제
                  </button>
                </div>
              )}

              <div className="lg:hidden">
                <BottomSheet isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)}>
                  <div className="flex flex-col">
                    <button
                      type="button"
                      onClick={handleUploadClick}
                      className="flex h-[52px] items-center gap-4 px-4 text-mobile-body text-gray-900"
                    >
                      <UploadIcon className="h-6 w-6 text-gray-900" />
                      사진 업로드
                    </button>
                    <div className="h-px w-full bg-gray-100" />
                    <button
                      type="button"
                      onClick={handleSelectAvatarMenu}
                      className="flex h-[52px] items-center gap-4 px-4 text-mobile-body text-gray-900"
                    >
                      <ProfileIcon className="h-6 w-6 text-gray-900" />
                      기본 아바타 선택
                    </button>
                    <div className="h-px w-full bg-gray-100" />
                    <button
                      type="button"
                      onClick={handleDeleteImage}
                      className="flex h-[52px] items-center gap-4 px-4 text-mobile-body text-red-700"
                    >
                      <TrashIcon className="h-6 w-6 text-red-700" />
                      사진 삭제
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsMenuOpen(false)}
                    className="mx-4 mt-4 flex h-11 items-center justify-center rounded-lg border border-gray-100 bg-white text-mobile-body font-bold text-gray-700"
                  >
                    취소
                  </button>
                </BottomSheet>
              </div>
            </div>
          </div>
          <span className="text-mobile-body font-bold text-gray-900 lg:text-xl">
            {nickname || name}
          </span>
        </div>

        <div className="flex w-full flex-1 flex-col">
          <h3 className="mb-5 hidden text-lg font-bold leading-snug text-gray-800 lg:block">
            기본 정보
          </h3>

          <div className="mb-4 flex flex-col gap-4 lg:mb-5 lg:grid lg:grid-cols-2 lg:gap-5">
            <div className="flex flex-col">
              <label
                htmlFor="name"
                className="mb-1.5 text-mobile-label font-bold text-gray-700 lg:mb-1 lg:text-sm lg:text-gray-900"
              >
                이름
              </label>
              <FormInput
                id="name"
                value={name}
                onChange={event => {
                  setName(event.target.value);
                  clearFieldError('name');
                }}
                placeholder="이름을 입력해주세요"
                maxLength={30}
                error={errors.name}
                className="h-11 text-mobile-label lg:h-[50px] lg:text-button"
              />
            </div>

            <div className="flex flex-col">
              <label
                htmlFor="nickname"
                className="mb-1.5 text-mobile-label font-bold text-gray-700 lg:mb-1 lg:text-sm lg:text-gray-900"
              >
                닉네임
              </label>
              <FormInput
                id="nickname"
                value={nickname}
                onChange={event => {
                  setNickname(event.target.value);
                  clearFieldError('nickname');
                }}
                placeholder="닉네임을 입력해주세요"
                maxLength={10}
                error={errors.nickname}
                className="h-11 text-mobile-label lg:h-[50px] lg:text-button"
              />
            </div>
          </div>

          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:gap-5">
            <div className="flex flex-1 flex-col">
              <label
                htmlFor="email"
                className="mb-1.5 text-mobile-label font-bold text-gray-700 lg:mb-1 lg:text-sm lg:text-gray-900"
              >
                이메일(변경 불가)
              </label>
              <FormInput
                id="email"
                value={email}
                disabled
                readOnly
                className="h-11 cursor-not-allowed border-transparent bg-gray-100 text-mobile-label text-gray-400 lg:h-[50px] lg:text-button"
              />
            </div>

            <Button
              type="button"
              onClick={() => void handleSave()}
              disabled={isSaving}
              variant="primary"
              className="w-full font-bold lg:w-32 lg:shrink-0"
            >
              {isSaving ? '처리 중...' : '저장'}
            </Button>
          </div>
        </div>
      </section>

      <AvatarSelectionModal
        isOpen={isAvatarModalOpen}
        onClose={() => setIsAvatarModalOpen(false)}
        onConfirm={handleConfirmAvatar}
        currentAvatar={profileImage ? (AVATAR_ID_BY_URL[profileImage] ?? profileImage) : null}
      />
    </>
  );
};
