import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { WarningModal } from '@/features/mypage/components/WarningModal'
import { Button } from '@/shared/components';
import LogoutIcon from "@/assets/icons/mypage/logout.svg?react"
import CrossIcon from "@/assets/icons/mypage/cross.svg?react"

export const MyPageButtonGroup = () => {
    const navigate = useNavigate();

    const [isWithdrawalModalOpen, setIsWithdrawalModalOpen] = useState(false);

    const handleLogout = () => {
        navigate('/login');
    };

    const handleWithdrawClick = () => {
        setIsWithdrawalModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsWithdrawalModalOpen(false);
    };

    const handleConfirmWithdraw = () => {
        console.log("회원 탈퇴 처리됨");
        setIsWithdrawalModalOpen(false);
        navigate('/login'); 
    };

    return (
        <>
            <div className="flex w-full items-center gap-5">
                <Button
                    variant='secondary'
                    size="lg"
                    className='flex-1'
                    leftIcon={
                        <LogoutIcon className='h-5 w-5' />
                    }
                    onClick={handleLogout}
                >
                    로그아웃
                </Button>

                <Button
                    variant='danger'
                    size="lg"
                    className='flex-1'
                    leftIcon={
                        <CrossIcon className='h-5 w-5' />
                    }
                    onClick={handleWithdrawClick}
                >
                    회원탈퇴
                </Button>
            </div>

            {/* 모달 렌더링 영역 */}
            <WarningModal 
                isOpen={isWithdrawalModalOpen} 
                onClose={handleCloseModal} 
                onConfirm={handleConfirmWithdraw} 
            />
        </>
    )
}