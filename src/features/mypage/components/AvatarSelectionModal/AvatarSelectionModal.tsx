import { useState, useEffect } from "react";
import { Modal, Button } from "@/shared/components";

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

const AVATAR_LIST = [
    { id: 'avatar-1', Component: Avatar1 },
    { id: 'avatar-2', Component: Avatar2 },
    { id: 'avatar-3', Component: Avatar3 },
    { id: 'avatar-4', Component: Avatar4 },
    { id: 'avatar-5', Component: Avatar5 },
    { id: 'avatar-6', Component: Avatar6 },
    { id: 'avatar-7', Component: Avatar7 },
    { id: 'avatar-8', Component: Avatar8 },
    { id: 'avatar-9', Component: Avatar9 },
    { id: 'avatar-10', Component: Avatar10 },
];

interface AvatarSelectionModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (avatarId: string) => void;
    currentAvatar?: string | null;
}

export const AvatarSelectionModal = ({ 
    isOpen, 
    onClose, 
    onConfirm, 
    currentAvatar 
}: AvatarSelectionModalProps) => {
    const [tempSelectedAvatar, setTempSelectedAvatar] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            setTempSelectedAvatar(currentAvatar || null);
        }
    }, [isOpen, currentAvatar]);

    if (!isOpen) return null;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            dismissible={false}
            className="flex w-[660px] max-w-none shrink-0 flex-col rounded-[20px] bg-white pb-6 pt-10 shadow-xl"
        >
            {/* 모달 타이틀 */}
            <h2 className="mb-8 text-center text-xl font-bold text-gray-900">
                아바타 선택
            </h2>
            
            {/* 아바타 그리드 */}
            <div className="mb-8 grid grid-cols-5 gap-5 px-10">
                {AVATAR_LIST.map(({ id, Component }) => (
                    <div key={id} className="flex justify-center">
                        <button
                            onClick={() => setTempSelectedAvatar(id)}
                            className={`relative h-25 w-25 overflow-hidden rounded-full transition-all ${
                                tempSelectedAvatar === id
                                    ? 'ring-2 ring-primary-500 ring-offset-2'
                                    : 'hover:ring-2 hover:ring-gray-200 hover:ring-offset-2'
                            }`}
                        >
                            <Component 
                                className="h-full w-full bg-gray-50 object-cover" 
                            />
                        </button>
                    </div>
                ))}
            </div>

            {/* 구분선 */}
            <div className="mb-7 h-px w-full bg-gray-100" />
            
            {/* 버튼 그룹 */}
            <div className="flex gap-3 px-8">
                <Button
                    variant="primary"
                    size="lg"
                    onClick={() => {
                        if (tempSelectedAvatar) onConfirm(tempSelectedAvatar);
                    }}
                    disabled={!tempSelectedAvatar}
                    className="flex-[2]"
                >
                    선택
                </Button>
                <Button
                    variant="secondary"
                    size="lg"
                    onClick={onClose}
                    className="flex-1 !border-gray-200 !bg-gray-200 !text-white hover:!bg-gray-300"
                >
                    취소
                </Button>
            </div>
        </Modal>
    );
};