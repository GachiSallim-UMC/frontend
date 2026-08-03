import type { SocialProvider } from "@/features/auth/types/auth.type"
import KakaoIcon from '@/assets/icons/login/kakao-small.svg?react'
import GoogleIcon from '@/assets/icons/login/google-small.svg?react'

interface SocialBadgeProps {
    provider: SocialProvider;
    email: string;
}

export const SocialBadge = ({ provider, email }: SocialBadgeProps) => {
    if (provider === 'Kakao') {
        return (
            <div className="flex h-11 w-[314] px-4 py-3 gap-2 items-center justify-center rounded-lg bg-kakao">
                <KakaoIcon className="h-4 w-4" />
                <span className="text-sm text-gray-700">
                    카카오 계정으로 로그인 · {email}
                </span>
            </div>
        );
    }

    return (
        <div className="flex h-11 w-[314] px-4 py-3 gap-2 items-center justify-center rounded-lg bg-white border border-gray-100">
                <GoogleIcon className="h-4 w-4" />
                <span className="text-sm text-gray-700">
                    구글 계정으로 로그인 · {email}
                </span>
            </div>
    )
}