import type { ChangeEvent, FormEvent, SyntheticEvent } from 'react';
import { Link } from 'react-router-dom';
import { FormInput } from '@/shared/components/form';
import { Button } from '@/shared/components/ui';
import { CheckboxGroup } from '@/shared/components/form';
import type { SignupFormData, SignupFormErrors } from '@/features/auth/types/auth.type'
import { isUnsignedIntegerInput } from '@/shared/lib/inputValidation';
import CircleIcon from "@/assets/icons/login/findingPassword/circle.svg?react"
import MailIcon from "@/assets/icons/login/findingPassword/mail.svg?react"


interface SignupFormProps {
    step: 1 | 2;
    formData: SignupFormData
    errors: SignupFormErrors;
    onFormDataChange: (data: SignupFormData) => void;
    agreedTerms: string[];
    onAgreedTermsChange: (value: string[]) => void;
    onConfirmEmail: (e: SyntheticEvent) => void;
    onSubmit?: (e: FormEvent) => void;
    isCodeError: boolean;
    isVerified: boolean;
    onFinalSubmit: (e: FormEvent) => void;
}

export const SignupForm = ({
    step,
    formData,
    errors,
    onFormDataChange,
    agreedTerms,
    onAgreedTermsChange,
    onConfirmEmail,
    onSubmit,
    isCodeError,
    isVerified,       
    onFinalSubmit,
}: SignupFormProps) => {

    const isAgree = agreedTerms.includes('terms');

    const handleChange = 
        (field: keyof SignupFormData) => (e: ChangeEvent<HTMLInputElement>) => {
            const value = e.target.value;
            if (field === 'verificationCode' && !isUnsignedIntegerInput(value)) return;
            onFormDataChange({...formData, [field]: value});
        };

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (onSubmit) {
            onSubmit(e);
        }
    }

    return (
        <div className="flex w-full flex-col">
            
            {/* step:1 회원 정보 입력 폼 */}
            {step === 1 && (
                <div className='flex flex-col'>
                    {/* 상단 타이틀 */}
                <div className="mb-5 flex flex-col items-center">
                    <h1 className="font-logo text-3xl font-medium tracking-wider text-gray-900">
                        같이살림
                    </h1>
                    <p className="text-sm font-medium text-gray-600">
                        새 계정 만들기
                    </p>
                </div>
                <form noValidate onSubmit={handleSubmit} className="flex flex-col">
                    {/* 이름 & 닉네임 영역 */}
                    <div className="mb-4 grid grid-cols-2 gap-4">
                        <div>
                            <label className="mb-2 block text-base font-bold text-gray-800">이름</label>
                            <FormInput
                                type="text"
                                maxLength={30}
                                placeholder="이름을 입력해주세요"
                                value={formData.name}
                                onChange={handleChange('name')}
                                error={errors.name}
                            />    
                        </div>
                        <div>
                            <label className="mb-2 block text-base font-bold text-gray-800">닉네임</label>
                            <FormInput
                                type="text"
                                maxLength={10}
                                placeholder="닉네임을 입력해주세요"
                                value={formData.nickname}
                                onChange={handleChange('nickname')}
                                error={errors.nickname}
                            />    
                        </div>
                    </div>

                    {/* 이메일 영역 */}
                    <div className="mb-4">
                        <label className="mb-2 block text-base font-bold text-gray-800">이메일</label>
                        <FormInput
                            type="email"
                            maxLength={100}
                            placeholder="이메일 주소를 입력해주세요"
                            value={formData.email}
                            onChange={handleChange('email')}
                            error={errors.email}
                        />
                    </div>

                    {/* 비밀번호 영역 */}
                    <div className="mb-4">
                        <label className="mb-2 block text-base font-bold text-gray-800">비밀번호</label>
                        <FormInput
                            type="password"
                            maxLength={16}
                            placeholder="비밀번호를 입력해주세요"
                            value={formData.password}
                            onChange={handleChange('password')}
                            error={errors.password}
                        />
                    </div>

                    {/* 비밀번호 확인 영역 */}
                    <div className="mb-4">
                        <label className="mb-2 block text-base font-bold text-gray-800">비밀번호 확인</label>
                        <FormInput
                            type="password"
                            maxLength={16}
                            placeholder="비밀번호를 다시 입력해주세요"
                            value={formData.passwordConfirm}
                            onChange={handleChange('passwordConfirm')}
                            error={errors.passwordConfirm}
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
                        가입 및 인증 메일 받기
                    </Button>
                </form>
                </div>
            )}

            {/* step:2 이메일 인증 코드 입력 폼 */}
            {step === 2 && (
                <div className='flex w-full flex-col'>
                    
                    {/* 아이콘 영역 */}
                    <div className="relative mb-5 flex items-center justify-center">
                        <CircleIcon className="h-18 w-18"></CircleIcon>
                        <MailIcon className="absolute top-1/2 left-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2"></MailIcon>
                    </div>
                    
                    {/* 타이틀 영역 */}
                    <div className="mb-5 text-center">
                        <h1 className="mb-1 text-2xl font-bold text-gray-900">인증 메일을 보냈어요</h1>
                        <p className="text-sm font-medium text-gray-600">
                            입력한 이메일로 전송된 인증번호를 확인해주세요.
                        </p>
                    </div>

                    {/* 폼 영역 */}
                    <form noValidate onSubmit={onFinalSubmit} className="flex w-full flex-col">

                        {/* 이메일 확인 영역 */}
                        <div className="mb-4 w-full">
                            <label className="mb-2 block text-base font-bold text-gray-800">이메일</label>
                            <FormInput
                                type="email"
                                value={formData.email}
                                readOnly
                                disabled
                                className="cursor-not-allowed border-transparent bg-gray-100 text-gray-400"
                            />
                        </div>

                        {/* 인증번호 입력 및 인증 버튼 영역 */}
                        <div className='mb-5 w-full'>
                            <label className="mb-2 block text-base font-bold text-gray-800">인증번호</label>
                            <div className='flex w-full gap-2'>
                                <div className='flex-1'>
                                    <FormInput
                                        type="text"
                                        inputMode="numeric"
                                        pattern="[0-9]*"
                                        maxLength={6}
                                        placeholder="인증번호 6자리를 입력해주세요"
                                        value={formData.verificationCode}
                                        disabled={isVerified}
                                        onChange={handleChange('verificationCode')}
                                        error={errors.verificationCode || (isCodeError ? '인증번호가 일치하지 않습니다.' : undefined)}
                                        className="w-full"
                                    />
                                </div>
                                {/* 우측 인증 버튼 */}
                                <Button
                                    type="button"
                                    onClick={onConfirmEmail}
                                    variant="primary"
                                    disabled={isVerified}
                                    className="shrink-0"
                                >
                                    인증
                                </Button>
                            </div>
                        </div>

                        {/* 최종 회원가입 버튼 */}
                        <Button
                            type="submit"
                            size="md"
                            disabled={!isVerified}
                            className={`w-full rounded-xl py-4 text-base font-bold transition-colors ${
                                isCodeError 
                                ? 'cursor-not-allowed border-none bg-gray-300 text-white hover:bg-gray-300' 
                                : 'bg-primary-500 text-white hover:bg-primary-600'
                            }`}
                        >
                            회원가입
                        </Button>

                    </form>
                </div>
            )}
        </div>
    );
};
