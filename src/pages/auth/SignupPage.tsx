import { Link } from 'react-router-dom';
import { SignupForm, useSignupForm } from '@/features/auth';

export const SignupPage = () => {
    const { 
        step,
        formData, 
        onFormDataChange, 
        agreedTerms, 
        onAgreedTermsChange,
        handleConfirmEmail,
        handleSubmitInfo,
        isCodeError,
        isVerified,
        handleFinalSubmit,
     } = useSignupForm();

    return (
        <div className="flex min-h-screen items-center justify-center bg-primary-100">
            {/* 흰 색 카드 */}
            <div className="h-[696px] w-full max-w-lg rounded-3xl bg-white px-10 pt-10 pb-8">

                <SignupForm 
                    step={step}
                    formData={formData}
                    onFormDataChange={onFormDataChange}
                    agreedTerms={agreedTerms}
                    onAgreedTermsChange={onAgreedTermsChange}
                    onConfirmEmail={handleConfirmEmail}
                    onSubmit={handleSubmitInfo}
                    isCodeError={isCodeError}
                    isVerified={isVerified}                
                    onFinalSubmit={handleFinalSubmit}
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
    );
};
