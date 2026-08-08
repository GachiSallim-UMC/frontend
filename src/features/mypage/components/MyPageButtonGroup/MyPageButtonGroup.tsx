import { useState } from 'react';
import { WarningModal } from '@/features/mypage/components/WarningModal'
import { Button } from '@/shared/components';
import { useAlertStore } from '@/shared/store';
import {myPageApi} from '@/features/mypage/api/myPage.api'
import { useLogout } from '@/features/auth';
import LogoutIcon from "@/assets/icons/mypage/logout.svg?react"
import CrossIcon from "@/assets/icons/mypage/cross.svg?react"

export const MyPageButtonGroup = () => {
    const showAlert = useAlertStore((state) => state.showAlert);

    const { mutate: logout, isPending: isLoggingOut } = useLogout();

    const [isWithdrawalModalOpen, setIsWithdrawalModalOpen] = useState(false);
    const [isWithdrawing, setIsWithdrawing] = useState(false);

    const handleLogout = () => {
        logout(); 
    };

    const handleConfirmWithdraw = async () => {
        setIsWithdrawing(true);
        try {
            await myPageApi.withdraw();
            showAlert({ title: '완료', message: '회원 탈퇴가 완료되었습니다.', tone: 'success' });
            setIsWithdrawalModalOpen(false);

            logout();
        } catch {
            showAlert({ title: '탈퇴 실패', message: '문제가 발생했습니다.' });
        } finally {
            setIsWithdrawing(false);
        }
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
                    disabled={isLoggingOut || isWithdrawing}
                    onClick={handleLogout}
                >
                    {isLoggingOut ? '로그아웃 중...' : '로그아웃'}
                </Button>

                <Button
                    variant='danger'
                    size="lg"
                    className='flex-1'
                    leftIcon={
                        <CrossIcon className='h-5 w-5' />
                    }
                    onClick={() => setIsWithdrawalModalOpen(true)}
                    disabled={isLoggingOut || isWithdrawing}
                >
                    회원탈퇴
                </Button>
            </div>

            {/* 모달 렌더링 영역 */}
            <WarningModal 
                isOpen={isWithdrawalModalOpen} 
                onClose={() => { if (!isWithdrawing) setIsWithdrawalModalOpen(false) }} 
                onConfirm={handleConfirmWithdraw} 
                isWithdrawing={isWithdrawing} 
            />
        </>
    )
}