import { Link, Navigate } from 'react-router-dom';
import {LoginForm, SocialLoginForm, useLogin, OAUTH_STATE_STORAGE_KEY} from "@/features/auth";
import { usePushSubscription } from '@/features/notification';
import { ApiError } from "@/shared/api";
import { useAuthStore } from '@/shared/store';
import Logo from "@/assets/logo.svg?react";

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
        <div className="flex min-h-screen items-center justify-center bg-primary-100">
            {/* 흰 색 카드 */}
            <div className="w-full max-w-lg rounded-3xl bg-white px-10 pt-10 pb-8">
                {/* 로고 */}
                <div className="mb-6 flex flex-col items-center">
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

                <div className="mt-8 flex gap-6 text-base font-bold text-primary-500 justify-center">
                    <Link to="/signup" className="hover:underline">회원가입</Link>
                    <Link to="/find-password" className="hover:underline">비밀번호 찾기</Link>
                </div>
            </div>
        </div> 
    )
}
