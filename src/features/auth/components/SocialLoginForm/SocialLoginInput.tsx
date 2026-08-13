import type { FormEvent, ChangeEvent } from "react";
import { Link } from "react-router-dom";
import { FormInput, CheckboxGroup, Button } from "@/shared/components"
import type { SocialFormDto } from "@/features/auth/types/auth.type"

interface SocialLoginInputProps {
    onSubmit?: (e: FormEvent) => void;
    formData: SocialFormDto
    onFormDataChange: (data: SocialFormDto) => void;
    agreedTerms: string[];
    onAgreedTermsChange: (value: string[]) => void;
    isSubmitting?: boolean;
    legalState?: Record<string, unknown>;
}

export const SocialLoginInput = ({
    onSubmit,
    formData,
    onFormDataChange,
    agreedTerms,
    onAgreedTermsChange,
    isSubmitting = false,
    legalState,
 }: SocialLoginInputProps) => {
    // 약관 동의 여부 확인
    const isAgree = agreedTerms.includes('terms');
    
    // 폼 유효성 검사
    const isFormValid = formData.name.trim() !== '' && formData.nickname.trim() !== '' && isAgree;
    
    const handleChange = 
        (field: keyof SocialFormDto) => (e: ChangeEvent<HTMLInputElement>) => {
            onFormDataChange({...formData, [field]: e.target.value});
        };
    
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (isFormValid && onSubmit) {
            onSubmit(e);
        }
    }

    return (
        
        <div className="flex w-full flex-col">
            <div className='flex flex-col'>
                <form onSubmit={handleSubmit} className="flex flex-col">
                    {/* 이름 영역 */}
                    <div className="mb-4">
                        <label htmlFor="social-signup-name" className="mt-4 mb-1 block text-mobile-body font-bold text-gray-700 lg:mb-2 lg:text-base lg:text-gray-800">
                            이름
                            <span className="text-red-700">*</span>
                            </label>
                        <FormInput
                            id="social-signup-name"
                            name="name"
                            type="text"
                            required
                            autoComplete="name"
                            maxLength={30}
                            placeholder="이름을 입력해주세요"
                            value={formData.name}
                            onChange={handleChange('name')}
                        />
                        <p className="mt-1.5 text-mobile-caption text-gray-500 lg:mt-1 lg:text-base lg:text-gray-400">최대 30자</p>
                    </div>

                    {/* 닉네임 영역 */}
                    <div className="mb-4">
                        <label htmlFor="social-signup-nickname" className="mb-1 block text-mobile-body font-bold text-gray-700 lg:mb-2 lg:text-base lg:text-gray-800">
                            닉네임
                            <span className="text-red-700">*</span>
                            </label>
                        <FormInput
                            id="social-signup-nickname"
                            name="nickname"
                            type="text"
                            required
                            autoComplete="nickname"
                            maxLength={10}
                            placeholder="닉네임을 입력해주세요"
                            value={formData.nickname}
                            onChange={handleChange('nickname')}
                            className="mb-2"
                        />
                        <p className="text-mobile-caption text-gray-500 lg:text-base lg:text-gray-400">2~10자 · 공백,특수문자 사용 불가</p>
                    </div>

                    {/* 약관 동의 체크박스 */}
                    <div className="mb-5 flex items-center gap-2">
                        <CheckboxGroup
                            name="terms"
                            required
                            value={agreedTerms}
                            onChange={onAgreedTermsChange}
                            options={[
                                {
                                value: 'terms',
                                label: (
                                    <span className="text-mobile-body font-medium text-gray-500 select-none lg:text-base">
                                        <Link to="/terms" state={{ ...legalState, formData, from: '/social-signup' }} className="text-primary-500 hover:underline">이용약관</Link>
                                        {' '}및{' '}
                                        <Link to="/privacy" state={{ ...legalState, formData, from: '/social-signup' }} className="text-primary-500 hover:underline">개인정보처리방침</Link>
                                        에 동의합니다.
                                    </span>
                                ),
                            },
                        ]}
                        />
                    </div>

                    {/* 제출 버튼 */}
                    <Button
                        type="submit"
                        variant="primary"
                        size="md"
                        disabled={!isFormValid || isSubmitting}
                        className="h-11 w-full text-mobile-body font-bold lg:h-[50px] lg:text-button"
                    >
                        {isSubmitting ? '처리 중...' : '시작하기'}
                    </Button>
                </form>
            </div>
        </div>
    );
};
