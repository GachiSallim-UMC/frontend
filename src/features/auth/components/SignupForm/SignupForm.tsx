import type { ChangeEvent, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { FormInput } from '@/shared/components/form';
import { Button } from '@/shared/components/ui';
import { CheckboxGroup } from '@/shared/components/form';
import type { SignupFormData } from '@/features/auth/types/auth.type'


interface SignupFormProps {
    formData: SignupFormData
    onFormDataChange: (data: SignupFormData) => void;
    agreedTerms: string[];
    onAgreedTermsChange: (value: string[]) => void;
    onSubmit?: (e: FormEvent) => void;
}

export const SignupForm = ({
    formData,
    onFormDataChange,
    agreedTerms,
    onAgreedTermsChange,
    onSubmit,
}: SignupFormProps) => {

    const isAgree = agreedTerms.includes('terms');

    const handleChange = 
        (field: keyof SignupFormData) => (e: ChangeEvent<HTMLInputElement>) => {
            onFormDataChange({...formData, [field]: e.target.value});
        };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (onSubmit) {
            onSubmit(e);
        }
    }

    return (
        <div className="flex w-full flex-col">
            <form onSubmit={handleSubmit} className="flex flex-col">
                {/* 이름 & 닉네임 영역 */}
                <div className="mb-4 grid grid-cols-2 gap-4">
                    <div>
                        <label className="mb-2 block text-base font-bold text-gray-800">이름</label>
                        <FormInput
                            type="text"
                            placeholder="이름을 입력해주세요"
                            value={formData.name}
                            onChange={handleChange('name')}
                        />    
                    </div>
                    <div>
                        <label className="mb-2 block text-base font-bold text-gray-800">닉네임</label>
                        <FormInput
                            type="text"
                            placeholder="닉네임을 입력해주세요"
                            value={formData.nickname}
                            onChange={handleChange('nickname')}
                        />    
                    </div>
                </div>

                {/* 이메일 영역 */}
                <div className="mb-4">
                    <label className="mb-2 block text-base font-bold text-gray-800">이메일</label>
                    <FormInput
                        type="email"
                        placeholder="이메일 주소를 입력해주세요"
                        value={formData.email}
                        onChange={handleChange('email')}
                    />
                </div>

                {/* 비밀번호 영역 */}
                <div className="mb-4">
                    <label className="mb-2 block text-base font-bold text-gray-800">비밀번호</label>
                    <FormInput
                        type="password"
                        placeholder="비밀번호를 입력해주세요"
                        value={formData.password}
                        onChange={handleChange('password')}
                    />
                </div>

                {/* 비밀번호 확인 영역 */}
                <div className="mb-4">
                    <label className="mb-2 block text-base font-bold text-gray-800">비밀번호 확인</label>
                    <FormInput
                        type="password"
                        placeholder="비밀번호를 다시 입력해주세요"
                        value={formData.passwordConfirm}
                        onChange={handleChange('passwordConfirm')}
                    />
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

                {/* 회원가입 제출 버튼 */}
                <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    disabled={!isAgree}
                >
                    회원가입
                </Button>

            </form>
        </div>
    );
};