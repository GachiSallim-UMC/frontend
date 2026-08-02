import KakaoIcon from '@/assets/icons/login/kakao.svg?react';
import GoogleIcon from '@/assets/icons/login/google.svg?react';

interface SocialLoginFormProps {
    onLoginClick: (provider: 'Google' | 'Kakao') => void;
}

export const SocialLoginForm = ({ onLoginClick }: SocialLoginFormProps) => {
    return (
        <div className="flex flex-col">
            {/* 구분선 */}
            <div className="relative flex items-center justify-center">
                <div className="absolute inset-x-0 h-px bg-gray-200" />
                <span className="relative bg-white px-3 text-sm font-bold text-gray-200">또는</span>
            </div>

            <div className="mt-5 mb-2 text-center text-sm font-bold text-gray-800">간편 로그인</div>

            {/* 소셜 로그인 버튼 */}
            <div className="flex gap-2 justify-center">
                <button 
                    type="button" 
                    aria-label="카카오 로그인" 
                    onClick={() => onLoginClick('Kakao')}
                    className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full transition-opacity hover:opacity-90"
                >
                    <KakaoIcon className="h-full w-full" />
                </button>
                <button 
                    type="button" 
                    aria-label="구글 로그인" 
                    onClick={() => onLoginClick('Google')}
                    className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full bg-white transition-colors hover:bg-gray-50"
                >
                    <GoogleIcon className="h-full w-full" />
                </button>
            </div>
        </div>
    ) 
}