import type { ChangeEvent } from 'react';
import { useState, useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Button, FormInput, BottomSheet, ConfirmModal } from '@/shared/components';
import { myPageApi } from '@/features/mypage/api/myPage.api';
import { AVATAR_ID_TO_URL, AVATAR_ID_BY_URL } from '@/features/mypage/constants/avatars';
import { NICKNAME_PATTERN, NICKNAME_PATTERN_MESSAGE } from '@/shared/lib/inputValidation';
import { useErrorStore } from '@/shared/store';
import CameraIcon from "@/assets/icons/mypage/camera.svg?react"
import UploadIcon from "@/assets/icons/mypage/upload.svg?react"
import TrashIcon from "@/assets/icons/mypage/trash.svg?react"
import ProfileIcon from "@/assets/icons/mypage/profile.svg?react"
import { AvatarSelectionModal } from '@/features/mypage/components/AvatarSelectionModal/AvatarSelectionModal';

export const ProfileBasicInfo = () => {
    const showError = useErrorStore((state) => state.showError);
    const queryClient = useQueryClient();

    const [name, setName] = useState<string>('홍길동');
    const [nickname, setNickname] = useState<string>('길동');
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [email, setEmail] = useState<string>('hong@example.com');
    const [errors, setErrors] = useState<Partial<Record<'name' | 'nickname', string>>>({});

    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    
    // 모달 상태 관리
    const [isAvatarModalOpen, setIsAvatarModalOpen] = useState<boolean>(false);
    const [isSaveModalOpen, setIsSaveModalOpen] = useState<boolean>(false);
    const [saveError, setSaveError] = useState<string | undefined>(undefined);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
    const [deleteError, setDeleteError] = useState<string | undefined>(undefined);

    const menuRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const fetchMyProfile = async () => {
            try {
                const myData = await myPageApi.me(); 
                
                setName(myData.name);
                setNickname(myData.nickname);
                setProfileImage(myData.profileImage || null);
                setEmail(myData.email);
            } catch (error: unknown) {
                const e = error as Error;
                console.error('프로필 정보 불러오기 실패:', e.message);
            }
        };

        fetchMyProfile();
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // 헤더 등 다른 화면에서 useMe()로 구독 중인 'auth' me 캐시를 무효화해 즉시 반영되게 함
    const invalidateMe = () => {
        queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
    };

    const renderProfileImage = () => {
        if (!profileImage) {
            return <div className='h-full w-full rounded-full bg-primary-400' />;
        }

        return (
            <img
                src={profileImage}
                alt="프로필 이미지"
                className='h-full w-full rounded-full border border-gray-100 bg-gray-50 object-cover'
            />
        );
    };

    const handleUploadClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
        setIsMenuOpen(false);
    };

    const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const validTypes = ['image/jpeg', 'image/png'];
        if (!validTypes.includes(file.type)) {
            showError({
                title: '지원하지 않는 파일 형식',
                message: 'JPG 또는 PNG 형식의 이미지만 업로드할 수 있습니다.'
            });
            event.target.value = ''; 
            return;
        }

        const MAX_SIZE = 10 * 1024 * 1024; 
        if (file.size > MAX_SIZE) {
            showError({
                title: '파일 용량 초과',
                message: '이미지 크기는 5MB를 초과할 수 없습니다.'
            });
            event.target.value = ''; 
            return;
        }

        try {
            setIsLoading(true);
            const uploadUrlInfo = await myPageApi.getUploadUrl({
                contentType: file.type,
                fileSize: file.size,
            });
            const finalImageUrl = await myPageApi.uploadToS3(uploadUrlInfo, file);
            await myPageApi.updateProfile({ name, nickname, profileImage: finalImageUrl });
            setProfileImage(finalImageUrl);
            invalidateMe();
        } catch (error: unknown) {
            const e = error as Error & { response?: { data?: { message?: string } } };
            console.error('S3 Upload Error:', e.response?.data?.message || e.message);
            showError({
                title: '업로드 실패',
                message: '이미지 업로드 중 오류가 발생했습니다. 다시 시도해주세요.'
            });
        } finally {
            setIsLoading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    // 아바타 선택 모달 열기
    const handleSelectAvatarMenu = () => {
        setIsAvatarModalOpen(true);
        setIsMenuOpen(false);
    };

    // 모달에서 아바타 선택 완료 시 호출 (selectedAvatarId 예: 'avatar-4')
    const handleConfirmAvatar = async (selectedAvatarId: string) => {
        setIsAvatarModalOpen(false);
        const avatarUrl = AVATAR_ID_TO_URL[selectedAvatarId];
        if (!avatarUrl) return;

        try {
            setIsLoading(true);
            await myPageApi.updateProfile({ name, nickname, profileImage: avatarUrl });
            setProfileImage(avatarUrl);
            invalidateMe();
        } catch (error: unknown) {
            const e = error as Error & { response?: { data?: { message?: string } } };
            console.error('Avatar Save Error:', e.response?.data?.message || e.message);
            showError({
                title: '저장 실패',
                message: '아바타 변경 중 오류가 발생했습니다. 다시 시도해주세요.'
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteImageClick = () => {
        setIsMenuOpen(false);
        setDeleteError(undefined);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDeleteImage = async () => {
        try {
            setIsLoading(true);
            await myPageApi.updateProfile({ name, nickname, profileImage: null });
            setProfileImage(null);
            invalidateMe();
            setIsDeleteModalOpen(false);
        } catch (error: unknown) {
            const e = error as Error & { response?: { data?: { message?: string } } };
            console.error('Profile Image Delete Error:', e.response?.data?.message || e.message);
            setDeleteError('프로필 이미지 삭제 중 오류가 발생했습니다. 다시 시도해주세요.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSaveClick = () => {
        const nextErrors: typeof errors = {};
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
        if (Object.keys(nextErrors).length > 0) {
            return;
        }

        setSaveError(undefined);
        setIsSaveModalOpen(true);
    };

    const handleConfirmSave = async () => {
        const trimmedName = name.trim();
        const trimmedNickname = nickname.trim();

        try {
            setIsLoading(true);
            const payload = { name: trimmedName, nickname: trimmedNickname, profileImage };

            await myPageApi.updateProfile(payload);
            invalidateMe();
            setIsSaveModalOpen(false);
        } catch (error: unknown) {
            const e = error as Error & { response?: { data?: { message?: string } } };
            console.error('Profile Save Error:', e.response?.data?.message || e.message);
            setSaveError('프로필 저장 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <>
            <section className="flex w-full flex-col items-center gap-4 lg:flex-row lg:items-start lg:gap-12 lg:rounded-2xl lg:bg-white lg:p-8">
                {/* 프로필 이미지 영역 */}
                <div className='flex shrink-0 flex-col items-center justify-center lg:pt-2'>
                    <div className='relative mb-2 h-[100px] w-[100px] lg:mb-4 lg:h-36 lg:w-36'>
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            accept="image/jpeg, image/png"
                            className="hidden"
                        />

                        {renderProfileImage()}

                        <div ref={menuRef} className='absolute bottom-0 right-0'>
                            <button
                                aria-label='프로필 이미지 변경'
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                disabled={isLoading}
                                className='flex h-7 w-7 items-center justify-center rounded-full border border-gray-100 bg-white shadow-md transition-colors hover:bg-gray-100 lg:h-10 lg:w-10'
                            >
                                <CameraIcon className="h-4 w-4 text-gray-700 lg:h-6 lg:w-6" />
                            </button>

                            {isMenuOpen && (
                                <div className="absolute right-0 top-8 z-20 hidden w-[180px] flex-col rounded-lg bg-white py-2 shadow-lg ring-1 ring-gray-900 ring-dropdown lg:left-12 lg:right-auto lg:top-0 lg:flex">
                                    <button
                                        onClick={handleUploadClick}
                                        className="flex items-center gap-3 px-5 py-3 text-sm font-medium text-gray-900 transition-colors hover:bg-gray-100"
                                    >
                                        <UploadIcon />
                                        사진 업로드
                                    </button>
                                    <button
                                        onClick={handleSelectAvatarMenu}
                                        className="flex items-center gap-3 px-5 py-3 text-sm font-medium text-gray-900 transition-colors hover:bg-gray-100"
                                    >
                                        <ProfileIcon />
                                        기본 아바타 선택
                                    </button>
                                    <button
                                        onClick={handleDeleteImageClick}
                                        className="flex items-center gap-3 px-5 py-3 text-sm font-medium text-red-700 transition-colors hover:bg-red-50"
                                    >
                                        <TrashIcon />
                                        사진 삭제
                                    </button>
                                </div>
                            )}

                            {/* 모바일: 프로필 이미지 변경 바텀시트 */}
                            <div className="lg:hidden">
                                <BottomSheet isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)}>
                                    <div className="flex flex-col">
                                        <button
                                            onClick={handleUploadClick}
                                            className="flex h-[52px] items-center gap-4 px-4 text-mobile-body text-gray-900"
                                        >
                                            <UploadIcon className="h-6 w-6 text-gray-900" />
                                            사진 업로드
                                        </button>
                                        <div className="h-px w-full bg-gray-100" />
                                        <button
                                            onClick={handleSelectAvatarMenu}
                                            className="flex h-[52px] items-center gap-4 px-4 text-mobile-body text-gray-900"
                                        >
                                            <ProfileIcon className="h-6 w-6 text-gray-900" />
                                            기본 아바타 선택
                                        </button>
                                        <div className="h-px w-full bg-gray-100" />
                                        <button
                                            onClick={handleDeleteImageClick}
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
                    <span className="text-mobile-body font-bold text-gray-900 lg:text-xl">{nickname || name}</span>
                </div>

                {/* 기본 정보 폼 */}
                <div className="flex w-full flex-1 flex-col">
                    <h3 className='mb-5 hidden text-lg font-bold leading-snug text-gray-800 lg:block'>
                        기본 정보
                    </h3>

                    <div className="mb-4 flex flex-col gap-4 lg:mb-5 lg:grid lg:grid-cols-2 lg:gap-5">
                        <div className='flex flex-col'>
                            <label htmlFor="name" className='mb-1.5 text-mobile-label font-bold text-gray-700 lg:mb-1 lg:text-sm lg:text-gray-900'>이름</label>
                            <FormInput
                                id="name"
                                value={name}
                                onChange={(e) => {
                                    setName(e.target.value);
                                    setErrors(previous => ({ ...previous, name: undefined }));
                                }}
                                placeholder='이름을 입력해주세요'
                                maxLength={30}
                                error={errors.name}
                                className="h-11 text-mobile-label lg:h-[50px] lg:text-button"
                            />
                        </div>

                        <div className='flex flex-col'>
                            <label htmlFor="nickname" className='mb-1.5 text-mobile-label font-bold text-gray-700 lg:mb-1 lg:text-sm lg:text-gray-900'>닉네임</label>
                            <FormInput
                                id="nickname"
                                value={nickname}
                                onChange={(e) => {
                                    setNickname(e.target.value);
                                    setErrors(previous => ({ ...previous, nickname: undefined }));
                                }}
                                placeholder='닉네임을 입력해주세요'
                                maxLength={10}
                                error={errors.nickname}
                                className="h-11 text-mobile-label lg:h-[50px] lg:text-button"
                            />
                        </div>
                    </div>

                    <div className='flex flex-col gap-4 lg:flex-row lg:items-end lg:gap-5'>
                        <div className='flex flex-1 flex-col'>
                            <label htmlFor="email" className='mb-1.5 text-mobile-label font-bold text-gray-700 lg:mb-1 lg:text-sm lg:text-gray-900'>
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
                            onClick={handleSaveClick}
                            disabled={isLoading}
                            variant="primary"
                            className="w-full font-bold lg:w-32 lg:shrink-0"
                        >
                        {isLoading ? '처리 중...' : '저장'}
                        </Button>
                    </div>
                </div>
            </section>

            {/* 분리된 아바타 선택 모달 컴포넌트 호출 */}
            <AvatarSelectionModal
                isOpen={isAvatarModalOpen}
                onClose={() => setIsAvatarModalOpen(false)}
                onConfirm={handleConfirmAvatar}
                currentAvatar={profileImage ? (AVATAR_ID_BY_URL[profileImage] ?? profileImage) : null}
            />

            {/* 프로필 저장 확인 모달 */}
            <ConfirmModal
                isOpen={isSaveModalOpen}
                onClose={() => setIsSaveModalOpen(false)}
                onConfirm={handleConfirmSave}
                icon={<ProfileIcon className="size-6" />}
                title="프로필을 저장할까요?"
                description="변경한 이름·닉네임·프로필 이미지로 저장합니다."
                isPending={isLoading}
                errorMessage={saveError}
            />

            {/* 사진 삭제 확인 모달 */}
            <ConfirmModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDeleteImage}
                icon={<TrashIcon className="size-6" />}
                title="프로필 사진을 삭제할까요?"
                description="기본 이미지로 되돌아갑니다."
                confirmLabel="삭제하기"
                tone="danger"
                isPending={isLoading}
                errorMessage={deleteError}
            />
        </>
    );
};
