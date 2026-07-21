import { useState, useEffect, useRef } from 'react';
import { Button, FormInput, SelectDropdown } from '@/shared/components';
import CameraIcon from "@/assets/icons/member/camera.svg?react";
import UploadIcon from "@/assets/icons/member/upload.svg?react"
import TrashIcon from "@/assets/icons/member/trash.svg?react"
import ProfileIcon from "@/assets/icons/member/profile.svg?react"
import CopyIcon from "@/assets/icons/member/copy.svg?react"

export const GroupBasicInfo = () => {
    const [groupName, setGroupName] = useState<string>('우리집 룸메이트');
    const [maxMemberCount, setMaxMemberCount] = useState<string>('4');
    const [description, setDescription] = useState<string>('함께 사는 공간, 서로 배려하며 지내요 :)');
    const groupCode = 'AB12-CD34'; 
    const createdAt = '2024.03.15';

    const maxMemberOptions = [
        { value: '2', label: '2명' },
        { value: '3', label: '3명' },
        { value: '4', label: '4명' },
        { value: '5', label: '5명' },
        { value: '6', label: '6명' },
    ];

    const handleSave = () => {
        console.log('그룹 정보 저장됨:', { groupName, maxMemberCount, description });
    };

    const handleCopyCode = () => {
        navigator.clipboard.writeText(groupCode);
        alert('그룹 코드가 복사되었습니다.');
    };

    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
    const menuRef = useRef<HTMLDivElement>(null);

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
        <section className='flex w-full items-start gap-23 rounded-2xl bg-white p-7'>

            {/* 좌측: 프로필 */}
            <div className='mx-20 flex shrink-0 flex-col items-center justify-center pt-2'>
                <div className='relative mb-4 h-36 w-36'>
                    <div className='h-full w-full rounded-full bg-primary-200 object-cover' />

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
                <span className="text-xl font-bold text-gray-900">{groupName}</span>
                <span className="text-sm text-gray-600">{createdAt}</span>
            </div>

            {/* 우측: 그룹 기본 정보 */}
            <div className='flex flex-1 flex-col'>
                <h3 className="mb-5 text-lg font-bold text-gray-900 leading-snug">
                    그룹 기본 정보
                </h3>

                {/* 그룹 이름 & 최대 인원 */}
                <div className='mb-5 grid grid-cols-2 gap-5'>
                    <div className='flex flex-col'>
                        <label htmlFor='groupName' className="mb-1 text-sm font-bold text-gray-900">
                            그룹 이름
                        </label>
                        <FormInput
                            id="groupName"
                            value={groupName}
                            onChange={(e) => setGroupName(e.target.value)}
                            placeholder='그룹 이름을 입력해주세요'
                        />
                    </div>
                    <SelectDropdown
                        id="maxMembers"
                        label="최대 인원"
                        value={maxMemberCount}
                        onChange={setMaxMemberCount}
                        options={maxMemberOptions}
                        placeholder="인원 선택"
                    />
                </div>
                
                {/* 그룹 소개 & 저장 */}
                <div className='mb-5 flex items-end gap-5'>
                    <div className='flex flex-1 flex-col gap-1'>
                        <label htmlFor='description' className="mb-1 text-sm font-bold text-gray-900">
                            그룹 소개
                        </label>
                        <FormInput
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder='그룹을 소개하는 한 줄 평을 적어주세요'
                        />
                    </div>

                    <Button 
                        onClick={handleSave}
                        variant="primary" 
                        className="w-32 shrink-0 font-bold h-[50px]"
                    >
                        저장
                    </Button>
                </div>

                {/* 그룹 코드 */}
                <div className='flex flex-1 flex-col gap-1'>
                    <label htmlFor='groupCode' className="mb-1 text-sm font-bold text-gray-900">
                        그룹 코드
                    </label>
                    <div className="relative flex-1">
                        <FormInput
                            id="groupCode"
                            value={groupCode} 
                            readOnly
                            className="w-full cursor-default border-gray-100 bg-gray-50 pr-12 text-gray-900 focus:border-gray-100 focus:ring-0"
                        />
                        <button
                            type="button"
                            onClick={handleCopyCode}
                            aria-label="그룹 코드 복사"
                            className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-md text-gray-600 transition-colors hover:bg-gray-200 hover:text-gray-900"
                        >
                            <CopyIcon className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    )
}