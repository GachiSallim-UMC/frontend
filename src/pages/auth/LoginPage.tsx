import { Link, Navigate } from 'react-router-dom';
import {LoginForm, SocialLoginForm, useLogin, OAUTH_STATE_STORAGE_KEY} from "@/features/auth";
import { usePushSubscription } from '@/features/notification';
import { ApiError } from "@/shared/api";
import { useAuthStore } from '@/shared/store';
import Logo from "@/assets/mobile-logo.svg?react";

export const LoginPage =() => {
    const isAuthenticated = useAuthStore(s => Boolean(s.accessToken && s.userId));
    const { mutate: login, isPending, error } = useLogin();
    const { requestPermission } = usePushSubscription();

    if (isAuthenticated) {
        return <Navigate to="/group" replace />;
    }

    const handleSocialLogin = (provider: 'Google' | 'Kakao') => {
        const cognitoDomain = import.meta.env.VITE_COGNITO_DOMAIN_URL;
        const clientId = import.meta.env.VITE_COGNITO_CLIENT_ID;
        const redirectUri = `${window.location.origin}/auth/callback`;

        // CSRF 방지: 콜백에서 이 값과 대조해 지금 시작한 로그인에서 온 code가 맞는지 검증
        const state = crypto.randomUUID();
        sessionStorage.setItem(OAUTH_STATE_STORAGE_KEY, state);

        const authorizeUrl = `${cognitoDomain}/oauth2/authorize?client_id=${clientId}&response_type=code&scope=openid+email+profile+aws.cognito.signin.user.admin&redirect_uri=${redirectUri}&identity_provider=${provider}&state=${state}`;

        window.location.href = authorizeUrl;
    };

    return (
        // 배경
        <div className="flex min-h-dvh flex-col items-center justify-center gap-6 bg-primary-100 px-4 py-10 lg:px-0 lg:py-0">
            {/* 로고 - 모바일 전용, 카드 밖 */}
            <div className="flex flex-col items-center gap-[15px] lg:hidden">
                <div className="flex h-[72px] w-16 items-center justify-center">
                    <Logo className="h-full w-full" />
                </div>
                <div className="flex flex-col items-center gap-[9px] text-center">
                    <h1 className="font-logo text-[26px] font-medium tracking-[1.04px] text-gray-900">같이살림</h1>
                    <p className="text-mobile-label font-medium text-gray-600">같이 사는 사람들의 생활 운영 서비스</p>
                </div>
            </div>

            {/* 흰 색 카드 */}
            <div className="w-full max-w-lg rounded-[20px] bg-white px-[18px] py-5 lg:rounded-3xl lg:px-10 lg:pb-8 lg:pt-10">
                {/* 로고 - 데스크톱 전용, 카드 안 */}
                <div className="mb-6 hidden flex-col items-center lg:flex">
                    <div className="mb-4 flex w-20 items-center justify-center">
                        <Logo />
                    </div>
                    <h1 className="mb-2 text-3xl text-gray-900 font-logo font-medium tracking-wider">같이살림</h1>
                    <p className="text-sm text-gray-600 font-medium">같이 사는 사람들의 생활 운영 서비스</p>
                </div>

                <LoginForm
                    onSubmit={credentials => {
                        requestPermission();
                        login(credentials);
                    }}
                    isSubmitting={isPending}
                    errorMessage={error instanceof ApiError ? error.message : undefined}
                />
                <SocialLoginForm onLoginClick={handleSocialLogin}/>

                <div className="mt-4 flex items-center justify-center gap-4 text-mobile-label font-bold text-primary-500 lg:gap-6 lg:text-base">
                    <Link to="/signup" className="hover:underline">회원가입</Link>
                    <span aria-hidden="true" className="h-[9px] w-px bg-gray-200" />
                    <Link to="/find-password" className="hover:underline">비밀번호 찾기</Link>
                </div>
            </div>
        </div>
    )
}
