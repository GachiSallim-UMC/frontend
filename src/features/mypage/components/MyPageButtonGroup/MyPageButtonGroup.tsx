import { useState } from 'react';
import { WarningModal } from '@/features/mypage/components/WarningModal'
import { Button } from '@/shared/components';
import { useErrorStore } from '@/shared/store';
import {myPageApi} from '@/features/mypage/api/myPage.api'
import { useLogout } from '@/features/auth';
import LogoutIcon from "@/assets/icons/mypage/logout.svg?react"
import CrossIcon from "@/assets/icons/mypage/cross.svg?react"

export const MyPageButtonGroup = () => {
    const showError = useErrorStore((state) => state.showError);

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
            alert('회원 탈퇴가 완료되었습니다.');
            setIsWithdrawalModalOpen(false);

            logout();
        } catch {
            showError({ title: '탈퇴 실패', message: '문제가 발생했습니다.' });
        } finally {
            setIsWithdrawing(false);
        }
    };

    return (
        <>
            <div className="flex w-full flex-col gap-2 lg:flex-row lg:items-center lg:gap-5">
                <Button
                    variant='secondary'
                    size="lg"
                    className='h-11 border-red-700 text-mobile-body text-red-700 hover:bg-red-100 lg:h-12 lg:flex-1 lg:border-gray-100 lg:text-base lg:text-gray-500 lg:hover:bg-gray-100'
                    leftIcon={
                        <LogoutIcon className='hidden h-5 w-5 lg:block' />
                    }
                    disabled={isLoggingOut || isWithdrawing}
                    onClick={handleLogout}
                >
                    {isLoggingOut ? '로그아웃 중...' : '로그아웃'}
                </Button>

                <Button
                    variant='danger'
                    size="lg"
                    className='h-11 text-mobile-body lg:h-12 lg:flex-1 lg:text-base'
                    leftIcon={
                        <CrossIcon className='hidden h-5 w-5 lg:block' />
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