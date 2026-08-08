import { Link, useNavigate } from 'react-router-dom';
import { SignupForm, useSignupForm } from '@/features/auth';
import Logo from '@/assets/mobile-logo.svg?react';
import ArrowIcon from '@/assets/icons/login/chevron-left.svg?react'

export const SignupPage = () => {
    const navigate = useNavigate();
    const {
        step,
        formData,
        errors,
        onFormDataChange,
        agreedTerms,
        onAgreedTermsChange,
        handleConfirmEmail,
        handleSubmitInfo,
        isCodeError,
        isVerified,
        isResending,
        handleFinalSubmit,
        handleResendCode,
     } = useSignupForm();

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
                    <h1 className="text-mobile-title font-bold tracking-[0.04em] text-gray-900">회원가입</h1>
                </header>

                <div className={`flex-1 px-4 pt-5 ${step === 1 ? 'pb-[calc(112px+env(safe-area-inset-bottom))]' : 'pb-[calc(24px+env(safe-area-inset-bottom))]'}`}>
                    {step === 1 && (
                        <div className="mb-5 flex flex-col items-start gap-1.5">
                            <div className="flex items-end gap-1.5">
                                <div className="flex h-[27px] w-6 items-center justify-center">
                                    <Logo className="h-full w-full" />
                                </div>
                                <span className="font-logo text-[20px] tracking-[0.8px] text-gray-900">같이살림</span>
                            </div>
                            <p className="text-mobile-label font-medium text-gray-600">새 계정 만들기</p>
                        </div>
                    )}

                    <SignupForm
                        variant="mobile"
                        step={step}
                        formData={formData}
                        errors={errors}
                        onFormDataChange={onFormDataChange}
                        agreedTerms={agreedTerms}
                        onAgreedTermsChange={onAgreedTermsChange}
                        onConfirmEmail={handleConfirmEmail}
                        onSubmit={handleSubmitInfo}
                        isCodeError={isCodeError}
                        isVerified={isVerified}
                        isResending={isResending}
                        onFinalSubmit={handleFinalSubmit}
                        onResendCode={handleResendCode}
                    />
                </div>
            </div>

            {/* 데스크톱 전용 화면 */}
            <div className="hidden min-h-screen items-center justify-center bg-primary-100 lg:flex">
                {/* 흰 색 카드 */}
                <div className="min-h-[696px] w-full max-w-lg rounded-3xl bg-white px-10 pt-10 pb-8">

                    <SignupForm
                        variant="desktop"
                        step={step}
                        formData={formData}
                        errors={errors}
                        onFormDataChange={onFormDataChange}
                        agreedTerms={agreedTerms}
                        onAgreedTermsChange={onAgreedTermsChange}
                        onConfirmEmail={handleConfirmEmail}
                        onSubmit={handleSubmitInfo}
                        isCodeError={isCodeError}
                        isVerified={isVerified}
                        isResending={isResending}
                        onFinalSubmit={handleFinalSubmit}
                        onResendCode={handleResendCode}
                    />

                    { /* 로그인 페이지 이동 링크 */}
                    <div className="mt-5 flex justify-center text-base text-gray-500">
                        이미 계정이 있으신가요?
                        <Link to="/login" className="ml-2 font-medium text-primary-500 hover:underline">
                            로그인
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
};
