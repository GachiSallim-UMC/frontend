import { useState, useEffect, useRef } from 'react';
import { Button, FormInput } from '@/shared/components';
import CameraIcon from "@/assets/icons/mypage/camera.svg?react"
import UploadIcon from "@/assets/icons/mypage/upload.svg?react"
import TrashIcon from "@/assets/icons/mypage/trash.svg?react"
import ProfileIcon from "@/assets/icons/mypage/profile.svg?react"

export const ProfileBasicInfo = () => {
    const [name, setName] = useState<string>('홍길동');
    const [nickname, setNickname] = useState<string>('길동');
    const email = 'hong@example.com'; 

    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const handleSave = () => {
        console.log('저장됨:', { name, nickname });
        // API 호출 로직 추가
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    
    return (
        <section className="flex w-full items-start gap-12 rounded-2xl bg-white p-8">
            {/* 프로필 이미지 */}
            <div className='flex shrink-0 flex-col items-center justify-center pt-2'>
                <div className='relative mb-4 h-36 w-36'>
                    <div className='h-full w-full rounded-full bg-primary-400 object-cover' />

                    {/* 카메라 버튼 및 드롭다운 메뉴 래퍼 */}
                    <div ref={menuRef} className='absolute bottom-0 right-0'>
                        <button  
                            aria-label='프로필 이미지 변경'
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className='flex h-10 w-10 items-center justify-center rounded-full border border-gray-100 bg-white shadow-md transition-colors hover:bg-gray-100'
                        >
                            <CameraIcon className="h-6 w-6 text-gray-700" />
                        </button>

                        {/* 팝업 드롭다운 창 */}
                        {isMenuOpen && (
                            <div className="absolute left-12 top-0 z-20 flex w-[180px] flex-col rounded-lg bg-white py-2 shadow-lg ring-1 ring-gray-900 ring-dropdown">
                                <button
                                    onClick={() => setIsMenuOpen(false)}
                                    className="flex items-center gap-3 px-5 py-3 text-sm font-medium text-gray-900 transition-colors hover:bg-gray-100"
                                >
                                    <UploadIcon />
                                    사진 업로드
                                </button>
                                <button
                                    onClick={() => setIsMenuOpen(false)}
                                    className="flex items-center gap-3 px-5 py-3 text-sm font-medium text-gray-900 transition-colors hover:bg-gray-100"
                                >
                                    <ProfileIcon />
                                    기본 아바타 선택
                                </button>
                                <button
                                    onClick={() => setIsMenuOpen(false)}
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
                        <label htmlFor="name" className='mb-1 text-sm font-bold text-gray-900'>닉네임</label>
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
                        <label htmlFor="name" className='mb-1 text-sm font-bold text-gray-900'>
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
                        variant="primary" 
                        className="w-32 shrink-0 font-bold" // Input 컴포넌트의 높이와 맞추기 위해 h 고정값을 주거나 py 사용
                    >
                     저장
                    </Button>
                </div>
            </div>
        </section>
    );
};