import { Link } from 'react-router-dom';
import { SignupForm, useSignupForm } from '@/features/auth';

export const SignupPage = () => {
    const { formData, onFormDataChange, agreedTerms, onAgreedTermsChange } = useSignupForm();

    return (
        <div className="flex min-h-screen items-center justify-center bg-primary-100">
            {/* 흰 색 카드 */}
            <div className="w-full max-w-lg rounded-3xl bg-white px-10 pt-10 pb-8">
                {/* 상단 타이틀 */}
                <div className="mb-5 flex flex-col items-center">
                    <h1 className="font-logo text-3xl font-medium tracking-wider text-gray-900">
                        같이살림
                    </h1>
                    <p className="text-sm font-medium text-gray-600">
                        새 계정 만들기
                    </p>
                </div>

                <SignupForm 
                    formData={formData}
                    onFormDataChange={onFormDataChange}
                    agreedTerms={agreedTerms}
                    onAgreedTermsChange={onAgreedTermsChange}
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
