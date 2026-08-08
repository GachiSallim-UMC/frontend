import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import {SocialBadge, SocialLoginInput, authApi } from '@/features/auth';
import type {SocialProvider, SocialFormDto } from '@/features/auth';
import { ApiError } from '@/shared/api';
import { useAlertStore, useAuthStore } from '@/shared/store';
import ArrowIcon from '@/assets/icons/login/chevron-left.svg?react'

export const SocialLoginPage = () => { 
    const navigate = useNavigate();
    const location = useLocation();
    const showAlert = useAlertStore(state => state.showAlert);
    const setSession = useAuthStore(state => state.setSession);

    // 콜백에서 넘겨준 데이터
    const { 
        provider = 'Kakao', 
        email = '', 
        accessToken = '',
        idToken = '',      
        refreshToken = '', 
        expiresIn = 0       
    } = location.state || {};

    const [formData, setFormData] = useState<SocialFormDto>({
        name: '',
        nickname: ''
    });

    const [agreedTerms, setAgreedTerms] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!accessToken) {
            showAlert({
                title: '인증 만료',
                message: '인증 정보가 만료되었거나 유효하지 않습니다. 다시 로그인해주세요.',
            });
            navigate('/login');
            return;
        }

        setIsSubmitting(true);
        try {
            const data = await authApi.socialSignup({
                name: formData.name,
                nickname: formData.nickname
            }, accessToken);

            setSession({
                accessToken,
                idToken,
                refreshToken,
                expiresIn,
                userId: String(data.userId), 
            });

            navigate('/group', { replace: true });
            
        } catch (error: unknown) {
            let status: number | undefined;
            let errorMessage = '회원가입 처리 중 문제가 발생했습니다.';

            if (error instanceof ApiError) {
                status = error.statusCode;
                errorMessage = error.message;
            } else if (error instanceof Error) {
                errorMessage = error.message;
            }

            if (status === 409) {
                showAlert({
                    title: '계정 연동 필요',
                    message: '이미 해당 이메일로 가입된 계정이 있습니다. 기존 계정에 소셜 로그인을 연결해야 합니다.',
                });
            } else if (status === 400) {
                showAlert({
                    title: '입력 정보 오류',
                    message: '잘못된 요청입니다. 입력하신 정보를 다시 확인해주세요.',
                });
            } else {
                showAlert({
                    title: '오류 발생',
                    message: errorMessage,
                });
            }
        } finally {
            setIsSubmitting(false);
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
                    <h1 className="text-mobile-title font-bold tracking-[0.04em] text-gray-900">추가 정보 입력</h1>
                </header>

                <div className="flex-1 px-4 pb-[calc(24px+env(safe-area-inset-bottom))] pt-5">
                    <div className="mb-5 flex flex-col items-center gap-4">
                        <span className="font-mobile-title font-bold text-lg tracking-wider text-gray-900">같이살림</span>
                        <span className="font-mobile-body font-bold text-gray-900">추가 정보 입력</span>
                        <p className="text-center text-mobile-label font-medium text-gray-600">
                            소셜 계정 인증이 완료되었습니다.<br/>
                        </p>
                    </div>

                    <div className="mb-5">
                        <SocialBadge
                            provider={provider as SocialProvider}
                            email={email || '이메일 정보 없음'}
                        />
                    </div>

                    <SocialLoginInput
                        formData={formData}
                        onFormDataChange={setFormData}
                        agreedTerms={agreedTerms}
                        onAgreedTermsChange={setAgreedTerms}
                        onSubmit={handleSubmit}
                        isSubmitting={isSubmitting}
                    />

                    <div className="mt-4 flex justify-center gap-2 text-mobile-body font-medium">
                        <span className="text-gray-500">다른 계정으로 로그인하시겠어요?</span>
                        <Link to="/login" className="text-primary-500 underline">로그인</Link>
                    </div>
                </div>
            </div>

            {/* 데스크톱 전용 화면 */}
            <div className="hidden min-h-screen items-center justify-center bg-primary-100 lg:flex">
                {/* 흰 색 카드 */}
                <div className="h-[696px] w-full max-w-lg rounded-3xl bg-white px-10 pt-10 pb-8">
                    <div className='mb-3 flex flex-col'>
                        {/* 상단 타이틀 */}
                        <div className="mb-3 flex flex-col items-center">
                            <h1 className="font-logo text-3xl font-medium tracking-wider text-gray-900">
                                같이살림
                            </h1>
                            <p className="mb-3 text-sm font-medium text-gray-600">
                                추가 정보 입력
                            </p>
                            <p className="text-sm font-medium text-gray-500 text-center">
                                소셜 계정 인증이 완료되었습니다.<br/>
                                서비스에서 사용할 정보를 입력해주세요.
                            </p>
                        </div>
                    </div>

                    <SocialBadge
                        provider={provider as SocialProvider}
                        email={email || '이메일 정보 없음'}
                    />

                    <SocialLoginInput
                        formData={formData}
                        onFormDataChange={setFormData}
                        agreedTerms={agreedTerms}
                        onAgreedTermsChange={setAgreedTerms}
                        onSubmit={handleSubmit}
                        isSubmitting={isSubmitting}
                    />

                    { /* 로그인 페이지 이동 링크 */}
                    <div className="mt-5 flex justify-center text-base text-gray-500">
                        다른 계정으로 로그인하시겠어요?
                        <Link to="/login" className="ml-2 font-medium text-primary-500 hover:underline">
                            로그인
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
};
