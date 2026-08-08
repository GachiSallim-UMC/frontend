import type { SocialProvider } from "@/features/auth/types/auth.type"
import KakaoIcon from '@/assets/icons/login/kakao-small.svg'
import GoogleIcon from '@/assets/icons/login/google-small.svg'

interface SocialBadgeProps {
    provider: SocialProvider;
    email: string;
}

export const SocialBadge = ({ provider, email }: SocialBadgeProps) => {
    if (provider === 'Kakao') {
        return (
            <div className="flex h-11 items-center justify-center gap-2 rounded-lg bg-kakao px-3 py-3 lg:px-4">
                <img src={KakaoIcon} alt="카카오" className="h-4 w-4" />
                <span className="text-mobile-label text-gray-700 lg:text-sm">
                    카카오 계정으로 로그인 · {email}
                </span>
            </div>
        );
    }

    return (
        <div className="flex h-11 items-center justify-center gap-2 rounded-lg border border-gray-100 bg-white px-3 py-3 lg:px-4">
            <img src={GoogleIcon} alt="구글" className="h-4 w-4" />
            <span className="text-mobile-label text-gray-700 lg:text-sm">
                구글 계정으로 로그인 · {email}
            </span>
        </div>
    )
}