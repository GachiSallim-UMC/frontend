import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import {SocialBadge, SocialLoginInput, authApi } from '@/features/auth';
import type {SocialProvider, SocialFormDto } from '@/features/auth';
import { ApiError } from '@/shared/api';
import { useErrorStore, useAuthStore } from '@/shared/store';

export const SocialLoginPage = () => { 
    const navigate = useNavigate();
    const location = useLocation();
    const showError = useErrorStore(state => state.showError);
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
            showError({
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
                const e = error as ApiError & { status?: number };
                status = e.status; 
                errorMessage = e.message;
            } else if (error instanceof Error) {
                const e = error as Error & { status?: number; response?: { status?: number } };
                status = e.status || e.response?.status;
            }

            if (status === 409) {
                showError({
                    title: '계정 연동 필요',
                    message: '이미 해당 이메일로 가입된 계정이 있습니다. 기존 계정에 소셜 로그인을 연결해야 합니다.',
                });
            } else if (status === 400) {
                showError({
                    title: '입력 정보 오류',
                    message: '잘못된 요청입니다. 입력하신 정보를 다시 확인해주세요.',
                });
            } else {
                showError({
                    title: '오류 발생',
                    message: errorMessage,
                });
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-primary-100">
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
    );
};
