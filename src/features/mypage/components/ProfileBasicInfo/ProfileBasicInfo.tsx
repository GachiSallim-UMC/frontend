import { useState, useEffect, useRef } from 'react';
import { Button, FormInput } from '@/shared/components';
import { authApi } from '@/features/auth';
import { useErrorStore } from '@/shared/store';
import CameraIcon from "@/assets/icons/mypage/camera.svg?react"
import UploadIcon from "@/assets/icons/mypage/upload.svg?react"
import TrashIcon from "@/assets/icons/mypage/trash.svg?react"
import ProfileIcon from "@/assets/icons/mypage/profile.svg?react"

export const ProfileBasicInfo = () => {
    const showError = useErrorStore((state) => state.showError);

    const [name, setName] = useState<string>('홍길동');
    const [nickname, setNickname] = useState<string>('길동');
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const email = 'hong@example.com'; 

    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const menuRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const fetchMyProfile = async () => {
            try {
                // 이전에 만들어두신 me API를 호출합니다.
                const myData = await authApi.me(); 
                
                // 서버에서 받아온 진짜 내 정보로 State 업데이트
                setName(myData.name);
                setNickname(myData.nickname);
                setProfileImage(myData.profileImage || null);
            } catch (error) {
                console.error('프로필 정보 불러오기 실패:', error);
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

    // 사진 업로드 클릭 시 숨겨진 파일 인풋 클릭 트리거
    const handleUploadClick = () => {
        fileInputRef.current?.click();
        setIsMenuOpen(false);
    };

    // 실제 파일 선택 및 S3 업로드 로직
    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // 파일 확장자 검사
        const validTypes = ['image/jpeg', 'image/png'];
        if (!validTypes.includes(file.type)) {
            showError({
                title: '지원하지 않는 파일 형식',
                message: 'JPG 또는 PNG 형식의 이미지만 업로드할 수 있습니다.'
            });
            if (fileInputRef.current) fileInputRef.current.value = '';
            return;
        }

        // 파일 용량 검사
        const MAX_SIZE = 5 * 1024 * 1024; // 5MB
        if (file.size > MAX_SIZE) {
            showError({
                title: '파일 용량 초과',
                message: '이미지 크기는 5MB를 초과할 수 없습니다.'
            });
            if (fileInputRef.current) fileInputRef.current.value = '';
            return;
        }

        try {
            setIsLoading(true);
            
            // 서버에 Presigned URL 요청
            const uploadUrlInfo = await authApi.getUploadUrl({
                contentType: file.type,
                fileSize: file.size,
            });

            // S3에 파일 직접 업로드
            const finalImageUrl = await authApi.uploadToS3(uploadUrlInfo, file);

            // 업로드 성공 시 화면 미리보기 업데이트
            setProfileImage(finalImageUrl);
        } catch (error) {
            console.error(error);
            showError({
                title: '업로드 실패',
                message: '이미지 업로드 중 오류가 발생했습니다. 다시 시도해주세요.'
            });
        } finally {
            setIsLoading(false);
            // 같은 파일을 다시 올릴 수 있도록 인풋 초기화
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    // 아바타 선택
    const handleSelectAvatar = () => {
        // TODO: 추후 아바타 선택 팝업 로직 추가
        setProfileImage(null); 
        setIsMenuOpen(false);
    };

    // 이미지 삭제
    const handleDeleteImage = () => {
        setProfileImage(null);
        setIsMenuOpen(false);
    };

    // 최종 프로필 정보 저장
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
            
            const result = await authApi.updateProfile(payload);
            console.log('저장 완료 데이터:', result);
            alert('프로필이 성공적으로 저장되었습니다.');
        } catch (error) {
            console.error(error);
            showError({
                title: '저장 실패',
                message: '프로필 저장 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
            });
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <section className="flex w-full items-start gap-12 rounded-2xl bg-white p-8">
            {/* 프로필 이미지 */}
            <div className='flex shrink-0 flex-col items-center justify-center pt-2'>
                <div className='relative mb-4 h-36 w-36'>
                    {/* 숨겨진 파일 인풋 */}
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleFileChange} 
                        accept="image/jpeg, image/png" 
                        className="hidden" 
                    />

                    {/* 이미지 렌더링 (null이면 Blue 400 단색 노출) */}
                    {profileImage ? (
                        <img 
                            src={profileImage} 
                            alt="프로필 이미지" 
                            className='h-full w-full rounded-full object-cover border border-gray-100'
                        />
                    ) : (
                        <div className='h-full w-full rounded-full bg-blue-400' />
                    )}

                    {/* 카메라 버튼 및 드롭다운 메뉴 래퍼 */}
                    <div ref={menuRef} className='absolute bottom-0 right-0'>
                        <button  
                            aria-label='프로필 이미지 변경'
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            disabled={isLoading}
                            className='flex h-10 w-10 items-center justify-center rounded-full border border-gray-100 bg-white shadow-md transition-colors hover:bg-gray-100'
                        >
                            <CameraIcon className="h-6 w-6 text-gray-700" />
                        </button>

                        {/* 팝업 드롭다운 창 */}
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
                                    onClick={handleSelectAvatar}
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
                <h3 className='mb-5 text-lg font-bold text-gray-800 leading-snug'>
                    기본 정보
                </h3>

                {/* 이름 & 닉네임 */}
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

                {/* 이메일 & 저장 버튼 */}
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
                            // 비활성화 상태의 배경색 및 텍스트 색상 적용
                            className="cursor-not-allowed border-transparent bg-gray-100 text-gray-400"
                        />
                    </div>

                    <Button 
                        onClick={handleSave}
                        disabled={isLoading}
                        variant="primary" 
                        className="w-32 shrink-0 font-bold" // Input 컴포넌트의 높이와 맞추기 위해 h 고정값을 주거나 py 사용
                    >
                     {isLoading ? '처리 중...' : '저장'}
                    </Button>
                </div>
            </div>
        </section>
    );
};