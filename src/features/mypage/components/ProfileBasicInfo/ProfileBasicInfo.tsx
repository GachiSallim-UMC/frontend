import type { ChangeEvent, FunctionComponent, SVGProps } from 'react';
import { useState, useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Button, FormInput } from '@/shared/components';
import { myPageApi } from '@/features/mypage/api/myPage.api';
import { useErrorStore } from '@/shared/store';
import CameraIcon from "@/assets/icons/mypage/camera.svg?react"
import UploadIcon from "@/assets/icons/mypage/upload.svg?react"
import TrashIcon from "@/assets/icons/mypage/trash.svg?react"
import ProfileIcon from "@/assets/icons/mypage/profile.svg?react"
import { AvatarSelectionModal } from '@/features/mypage/components/AvatarSelectionModal/AvatarSelectionModal';

import Avatar1 from '@/assets/icons/mypage/Avatar/avatar-1.svg?react';
import Avatar2 from '@/assets/icons/mypage/Avatar/avatar-2.svg?react';
import Avatar3 from '@/assets/icons/mypage/Avatar/avatar-3.svg?react';
import Avatar4 from '@/assets/icons/mypage/Avatar/avatar-4.svg?react';
import Avatar5 from '@/assets/icons/mypage/Avatar/avatar-5.svg?react';
import Avatar6 from '@/assets/icons/mypage/Avatar/avatar-6.svg?react';
import Avatar7 from '@/assets/icons/mypage/Avatar/avatar-7.svg?react';
import Avatar8 from '@/assets/icons/mypage/Avatar/avatar-8.svg?react';
import Avatar9 from '@/assets/icons/mypage/Avatar/avatar-9.svg?react';
import Avatar10 from '@/assets/icons/mypage/Avatar/avatar-10.svg?react';

// 백엔드 profileImage는 URL 문자열만 허용하므로, 아바타 svg를 URL로도 가져와서 매핑한다.
import Avatar1Url from '@/assets/icons/mypage/Avatar/avatar-1.svg';
import Avatar2Url from '@/assets/icons/mypage/Avatar/avatar-2.svg';
import Avatar3Url from '@/assets/icons/mypage/Avatar/avatar-3.svg';
import Avatar4Url from '@/assets/icons/mypage/Avatar/avatar-4.svg';
import Avatar5Url from '@/assets/icons/mypage/Avatar/avatar-5.svg';
import Avatar6Url from '@/assets/icons/mypage/Avatar/avatar-6.svg';
import Avatar7Url from '@/assets/icons/mypage/Avatar/avatar-7.svg';
import Avatar8Url from '@/assets/icons/mypage/Avatar/avatar-8.svg';
import Avatar9Url from '@/assets/icons/mypage/Avatar/avatar-9.svg';
import Avatar10Url from '@/assets/icons/mypage/Avatar/avatar-10.svg';

const AVATAR_COMPONENTS: Record<string, FunctionComponent<SVGProps<SVGSVGElement>>> = {
    'avatar-1': Avatar1,
    'avatar-2': Avatar2,
    'avatar-3': Avatar3,
    'avatar-4': Avatar4,
    'avatar-5': Avatar5,
    'avatar-6': Avatar6,
    'avatar-7': Avatar7,
    'avatar-8': Avatar8,
    'avatar-9': Avatar9,
    'avatar-10': Avatar10,
};

const AVATAR_ID_TO_ASSET_PATH: Record<string, string> = {
    'avatar-1': Avatar1Url,
    'avatar-2': Avatar2Url,
    'avatar-3': Avatar3Url,
    'avatar-4': Avatar4Url,
    'avatar-5': Avatar5Url,
    'avatar-6': Avatar6Url,
    'avatar-7': Avatar7Url,
    'avatar-8': Avatar8Url,
    'avatar-9': Avatar9Url,
    'avatar-10': Avatar10Url,
};

// 서버는 절대 URL만 유효한 profileImage로 받아들이므로 origin을 붙여 절대 URL로 변환한다.
const toAbsoluteUrl = (path: string) => new URL(path, window.location.origin).toString();

const AVATAR_ID_TO_URL: Record<string, string> = Object.fromEntries(
    Object.entries(AVATAR_ID_TO_ASSET_PATH).map(([id, path]) => [id, toAbsoluteUrl(path)])
);

const AVATAR_ID_BY_URL: Record<string, string> = Object.fromEntries(
    Object.entries(AVATAR_ID_TO_URL).map(([id, url]) => [url, id])
);

export const ProfileBasicInfo = () => {
    const showError = useErrorStore((state) => state.showError);
    const queryClient = useQueryClient();

    const [name, setName] = useState<string>('홍길동');
    const [nickname, setNickname] = useState<string>('길동');
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [email, setEmail] = useState<string>('hong@example.com');

    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    
    // 모달 상태 관리
    const [isAvatarModalOpen, setIsAvatarModalOpen] = useState<boolean>(false);

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

        const AvatarSvg = AVATAR_COMPONENTS[profileImage];
        if (AvatarSvg) {
            return (
                <AvatarSvg className="h-full w-full rounded-full border border-gray-100 bg-gray-50 object-cover" />
            );
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

    const handleDeleteImage = async () => {
        setIsMenuOpen(false);
        try {
            setIsLoading(true);
            await myPageApi.updateProfile({ name, nickname, profileImage: null });
            setProfileImage(null);
            invalidateMe();
        } catch (error: unknown) {
            const e = error as Error & { response?: { data?: { message?: string } } };
            console.error('Profile Image Delete Error:', e.response?.data?.message || e.message);
            showError({
                title: '삭제 실패',
                message: '프로필 이미지 삭제 중 오류가 발생했습니다. 다시 시도해주세요.'
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async () => {
        if (!name.trim() || !nickname.trim()) {
            showError({
                title: '입력 정보 누락',
                message: '이름과 닉네임을 모두 입력해주세요.'
            });
            return;
        }

        try {
            setIsLoading(true);
            const payload = { name, nickname, profileImage };
            
            const result = await myPageApi.updateProfile(payload);
            console.log('저장 완료 데이터:', result);
            invalidateMe();
            alert('프로필이 성공적으로 저장되었습니다.');
        } catch (error: unknown) {
            const e = error as Error & { response?: { data?: { message?: string } } };
            console.error('Profile Save Error:', e.response?.data?.message || e.message);
            showError({
                title: '저장 실패',
                message: '프로필 저장 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
            });
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <>
            <section className="flex w-full items-start gap-12 rounded-2xl bg-white p-8">
                {/* 프로필 이미지 영역 */}
                <div className='flex shrink-0 flex-col items-center justify-center pt-2'>
                    <div className='relative mb-4 h-36 w-36'>
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
                                className='flex h-10 w-10 items-center justify-center rounded-full border border-gray-100 bg-white shadow-md transition-colors hover:bg-gray-100'
                            >
                                <CameraIcon className="h-6 w-6 text-gray-700" />
                            </button>

                            {isMenuOpen && (
                                <div className="absolute left-12 top-0 z-20 flex w-[180px] flex-col rounded-lg bg-white py-2 shadow-lg ring-1 ring-gray-900 ring-dropdown">
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
                                        onClick={handleDeleteImage}
                                        className="flex items-center gap-3 px-5 py-3 text-sm font-medium text-red-700 transition-colors hover:bg-red-50"
                                    >
                                        <TrashIcon />
                                        사진 삭제
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                    <span className="text-xl font-bold text-gray-900">{name}</span>
                </div>

                {/* 기본 정보 폼 */}
                <div className="flex flex-1 flex-col">
                    <h3 className='mb-5 text-lg font-bold leading-snug text-gray-800'>
                        기본 정보
                    </h3>

                    <div className="mb-5 grid grid-cols-2 gap-5">
                        <div className='flex flex-col'>
                            <label htmlFor="name" className='mb-1 text-sm font-bold text-gray-900'>이름</label>
                            <FormInput
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder='이름을 입력해주세요'
                            />
                        </div>

                        <div className='flex flex-col'>
                            <label htmlFor="nickname" className='mb-1 text-sm font-bold text-gray-900'>닉네임</label>
                            <FormInput
                                id="nickname"
                                value={nickname}
                                onChange={(e) => setNickname(e.target.value)}
                                placeholder='닉네임을 입력해주세요'
                            />
                        </div>
                    </div>

                    <div className='flex items-end gap-5'>
                        <div className='flex flex-1 flex-col'>
                            <label htmlFor="email" className='mb-1 text-sm font-bold text-gray-900'>
                                이메일(변경 불가)
                            </label>
                            <FormInput
                                id="email"
                                value={email} 
                                disabled 
                                readOnly
                                className="cursor-not-allowed border-transparent bg-gray-100 text-gray-400"
                            />
                        </div>

                        <Button 
                            onClick={handleSave}
                            disabled={isLoading}
                            variant="primary" 
                            className="w-32 shrink-0 font-bold"
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
        </>
    );
};