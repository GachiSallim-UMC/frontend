import { FormEvent, ChangeEvent } from "react";
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
}

export const SocialLoginInput = ({ 
    onSubmit, 
    formData, 
    onFormDataChange,
    agreedTerms,
    onAgreedTermsChange,
    isSubmitting = false,
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
                        <label className="mt-5 mb-2 block text-base font-bold text-gray-800">
                            이름
                            <span className="text-red-700">*</span>
                            </label>
                        <FormInput
                            type="text"
                            placeholder="이름을 입력해주세요"
                            value={formData.name}
                            onChange={handleChange('name')}
                        />
                    </div>

                    {/* 닉네임 영역 */}
                    <div className="mb-4">
                        <label className="mt-5 mb-2 block text-base font-bold text-gray-800">
                            닉네임
                            <span className="text-red-700">*</span>
                            </label>
                        <FormInput
                            type="text"
                            placeholder="닉네임을 입력해주세요"
                            value={formData.nickname}
                            onChange={handleChange('nickname')}
                            className="mb-2"
                        />
                        <p className="text-base text-gray-400">2~10자 · 공백,특수문자 사용 불가</p>
                    </div>

                    {/* 약관 동의 체크박스 */}
                    <div className="mb-5 flex items-center gap-2">
                        <CheckboxGroup
                            value={agreedTerms}
                            onChange={onAgreedTermsChange}
                            options={[
                                {
                                value: 'terms',
                                label: (
                                    <span className="text-base text-gray-500 font-medium select-none">
                                        <Link to="/terms" state={{formData}} className="text-primary-500 hover:underline">이용약관</Link>
                                        {' '}및{' '}
                                        <Link to="/privacy" state={{formData}} className="text-primary-500 hover:underline">개인정보처리방침</Link>
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
                    >
                        {isSubmitting ? '처리 중...' : '시작하기'}
                    </Button>
                </form>
            </div>
        </div>
    );
};