import { useNavigate } from 'react-router-dom';
import { Button } from '@/shared/components';
import LogoutIcon from "@/assets/icons/mypage/logout.svg?react"
import CrossIcon from "@/assets/icons/mypage/cross.svg?react"

export const MyPageButtonGroup = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        navigate('/login');
    };

    const handleWithdraw = () => {
        
    };

    return (
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
                onClick={handleWithdraw}
            >
                회원탈퇴
            </Button>
        </div>
    )
}