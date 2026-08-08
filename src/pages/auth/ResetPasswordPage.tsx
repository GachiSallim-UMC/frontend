import { useState, useEffect, type FormEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ResetPasswordForm, authApi, type ResetPasswordFormData } from '@/features/auth';
import { useAlertStore } from '@/shared/store';
import Logo from "@/assets/mobile-logo.svg?react";
import ArrowIcon from '@/assets/icons/login/chevron-left.svg?react'

export const ResetPasswordPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const showAlert = useAlertStore(state => state.showAlert);
    
    const [isLoading, setIsLoading] = useState(false);
    const [urlParams, setUrlParams] = useState({ email: '', code: '' });
    
    const [formData, setFormData] = useState<ResetPasswordFormData>({
        newPassword: '',
        newPasswordConfirm: '',
    });

    useEffect(() => {
        const searchString = location.search || location.hash.replace('#', '?');
        const params = new URLSearchParams(searchString);
        
        const email = params.get('email');
        const code = params.get('code');

        if (email && code) {
            setUrlParams({ email, code });
        } else {
            showAlert({
                title: '유효하지 않은 접근',
                message: '비밀번호 재설정 링크가 올바르지 않거나 만료되었습니다.'
            });
            navigate('/login', { replace: true });
        }
    }, [location, navigate, showAlert]);

    const handleFormDataChange = (field: keyof ResetPasswordFormData) => 
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setFormData(prev => ({ ...prev, [field]: e.target.value }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (formData.newPassword !== formData.newPasswordConfirm) {
            showAlert({
                title: '비밀번호 오류',
                message: '새 비밀번호가 일치하지 않습니다. 다시 확인해 주세요.'
            });
            return;
        }

        setIsLoading(true);

        try {
            await authApi.resetPassword({
                email: urlParams.email,
                confirmationCode: urlParams.code,
                newPassword: formData.newPassword
            });

            showAlert({
                title: '완료',
                message: '비밀번호가 성공적으로 재설정되었습니다. 다시 로그인해 주세요.',
                tone: 'success',
            });
            navigate('/login', { replace: true });

        } catch (error: unknown) {
            let errorMessage = '비밀번호 재설정 중 오류가 발생했습니다.';

            if (error instanceof Error) {
                const e = error as Error & { response?: { data?: { message?: string } } };
                errorMessage = e.response?.data?.message || e.message;
            }

            showAlert({
                title: '재설정 실패',
                message: errorMessage
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {/* 모바일 전용 화면 */}
            <div className="flex min-h-dvh flex-col bg-white lg:hidden">
                <header className="sticky top-0 z-10 flex h-[52px] shrink-0 items-center justify-center border-b border-gray-100 bg-white px-4">
                    <button
                        type="button"
                        aria-label="뒤로 가기"
                        onClick={() => navigate('/login')}
                        className="absolute left-4 flex size-6 items-center justify-center text-gray-900"
                    >
                        <ArrowIcon className="size-6" strokeWidth={1.5} />
                    </button>
                    <h1 className="text-mobile-title font-bold tracking-[0.04em] text-gray-900">비밀번호 재설정</h1>
                </header>

                <div className="flex-1 px-4 pt-5">
                    <div className="mb-5 flex flex-col items-start gap-1">
                        <div className="flex items-end gap-1.5">
                            <div className="flex h-[27px] w-6 items-center justify-center">
                                <Logo className="h-full w-full" />
                            </div>
                            <span className="font-logo text-lg tracking-wider text-gray-900">같이살림</span>
                        </div>
                        <p className="text-mobile-label font-medium text-gray-600">비밀번호 재설정</p>
                    </div>

                    <ResetPasswordForm
                        formData={formData}
                        onChange={handleFormDataChange}
                        onSubmit={handleSubmit}
                        isLoading={isLoading}
                    />
                </div>
            </div>

            {/* 데스크톱 전용 화면 */}
            <div className="hidden min-h-screen items-center justify-center bg-primary-100 lg:flex">
                <div className="flex h-[696px] w-full max-w-lg flex-col rounded-3xl bg-white px-10 pb-8 pt-10">
                    <div className="mb-8 flex flex-col items-center">
                        <h1 className="font-logo text-3xl font-medium tracking-wider text-gray-900">
                            같이살림
                        </h1>
                        <p className="mt-2 text-sm font-medium text-gray-600">
                            비밀번호 재설정
                        </p>
                    </div>

                    <ResetPasswordForm
                        formData={formData}
                        onChange={handleFormDataChange}
                        onSubmit={handleSubmit}
                        isLoading={isLoading}
                    />
                </div>
            </div>
        </>
    );
};