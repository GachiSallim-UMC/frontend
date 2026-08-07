import { useState, useEffect } from "react";
import { Modal, Button, BottomSheet } from "@/shared/components";
import { DEFAULT_AVATARS } from "@/features/mypage/constants/avatars";

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
        <>
            {/* 모바일: 바텀시트 */}
            <div className="lg:hidden">
                <BottomSheet isOpen={isOpen} onClose={onClose} title="아바타 선택">
                    <div className="grid grid-cols-5 gap-[15px] px-4 py-4">
                        {DEFAULT_AVATARS.map(({ id, url }) => (
                            <button
                                key={id}
                                onClick={() => setTempSelectedAvatar(id)}
                                className={`aspect-square overflow-hidden rounded-full transition-all ${
                                    tempSelectedAvatar === id
                                        ? 'ring-2 ring-primary-500 ring-offset-2'
                                        : ''
                                }`}
                            >
                                <img
                                    src={url}
                                    alt={id}
                                    className="h-full w-full bg-gray-50 object-cover"
                                />
                            </button>
                        ))}
                    </div>
                    <div className="px-4 pb-2 pt-2">
                        <Button
                            variant="primary"
                            onClick={() => {
                                if (tempSelectedAvatar) onConfirm(tempSelectedAvatar);
                            }}
                            disabled={!tempSelectedAvatar}
                            className="h-11 w-full text-mobile-body font-bold"
                        >
                            선택 완료
                        </Button>
                    </div>
                </BottomSheet>
            </div>

            {/* 데스크톱: 중앙 모달 */}
            <div className="hidden lg:block">
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
                        {DEFAULT_AVATARS.map(({ id, url }) => (
                            <div key={id} className="flex justify-center">
                                <button
                                    onClick={() => setTempSelectedAvatar(id)}
                                    className={`relative h-25 w-25 overflow-hidden rounded-full transition-all ${
                                        tempSelectedAvatar === id
                                            ? 'ring-2 ring-primary-500 ring-offset-2'
                                            : 'hover:ring-2 hover:ring-gray-200 hover:ring-offset-2'
                                    }`}
                                >
                                    <img
                                        src={url}
                                        alt={id}
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
            </div>
        </>
    );
};