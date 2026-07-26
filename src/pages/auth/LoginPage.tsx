import { Link, Navigate } from 'react-router-dom';
import {LoginForm, SocialLoginForm, useLogin} from "@/features/auth";
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
                <SocialLoginForm />

                <div className="mt-8 flex gap-6 text-base font-bold text-primary-500 justify-center">
                    <Link to="/signup" className="hover:underline">회원가입</Link>
                    <Link to="/find-password" className="hover:underline">비밀번호 찾기</Link>
                </div>
            </div>
        </div> 
    )
}
