import type { ChangeEvent, FormEvent, SyntheticEvent } from 'react';
import { Link } from 'react-router-dom';
import { FormInput } from '@/shared/components/form';
import { Button } from '@/shared/components/ui';
import { CheckboxGroup } from '@/shared/components/form';
import type { SignupFormData, SignupFormErrors } from '@/features/auth/types/auth.type'
import { isUnsignedIntegerInput } from '@/shared/lib/inputValidation';
import CircleIcon from "@/assets/icons/login/findingPassword/circle.svg?react"
import MailIcon from "@/assets/icons/login/findingPassword/mail.svg?react"
import WarningIcon from "@/assets/icons/login/warning.svg?react"
import Logo from "@/assets/mobile-logo.svg?react"

interface SignupFormProps {
    variant: 'mobile' | 'desktop';
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
    isResending?: boolean;
    onFinalSubmit: (e: FormEvent) => void;
    onResendCode?: () => void;
}

export const SignupForm = ({
    variant,
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
    isResending,
    onFinalSubmit,
    onResendCode,
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
            
            {/* step:1 회원 정보 입력 폼 - 데스크톱 */}
            {step === 1 && variant === 'desktop' && (
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
                            <label htmlFor="signup-name" className="mb-2 block text-base font-bold text-gray-800">이름</label>
                            <FormInput
                                id="signup-name"
                                name="name"
                                type="text"
                                required
                                autoComplete="name"
                                maxLength={30}
                                placeholder="이름을 입력해주세요"
                                value={formData.name}
                                onChange={handleChange('name')}
                                error={errors.name}
                                errorIcon={<WarningIcon className="size-3.5 shrink-0" />}
                            />
                        </div>
                        <div>
                            <label htmlFor="signup-nickname" className="mb-2 block text-base font-bold text-gray-800">닉네임</label>
                            <FormInput
                                id="signup-nickname"
                                name="nickname"
                                type="text"
                                required
                                autoComplete="nickname"
                                maxLength={10}
                                placeholder="닉네임을 입력해주세요"
                                value={formData.nickname}
                                onChange={handleChange('nickname')}
                                error={errors.nickname}
                                errorIcon={<WarningIcon className="size-3.5 shrink-0" />}
                            />
                        </div>
                    </div>

                    {/* 이메일 영역 */}
                    <div className="mb-4">
                        <label htmlFor="signup-email" className="mb-2 block text-base font-bold text-gray-800">이메일</label>
                        <FormInput
                            id="signup-email"
                            name="email"
                            type="email"
                            required
                            autoComplete="email"
                            maxLength={100}
                            placeholder="이메일 주소를 입력해주세요"
                            value={formData.email}
                            onChange={handleChange('email')}
                            error={errors.email}
                            errorIcon={<WarningIcon className="size-3.5 shrink-0" />}
                        />
                    </div>

                    {/* 비밀번호 영역 */}
                    <div className="mb-4">
                        <label htmlFor="signup-password" className="mb-2 block text-base font-bold text-gray-800">비밀번호</label>
                        <FormInput
                            id="signup-password"
                            name="password"
                            type="password"
                            required
                            autoComplete="new-password"
                            maxLength={16}
                            placeholder="비밀번호를 입력해주세요"
                            value={formData.password}
                            onChange={handleChange('password')}
                            error={errors.password}
                            errorIcon={<WarningIcon className="size-3.5 shrink-0" />}
                        />
                    </div>

                    {/* 비밀번호 확인 영역 */}
                    <div className="mb-4">
                        <label htmlFor="signup-password-confirm" className="mb-2 block text-base font-bold text-gray-800">비밀번호 확인</label>
                        <FormInput
                            id="signup-password-confirm"
                            name="passwordConfirm"
                            type="password"
                            required
                            autoComplete="new-password"
                            maxLength={16}
                            placeholder="비밀번호를 다시 입력해주세요"
                            value={formData.passwordConfirm}
                            onChange={handleChange('passwordConfirm')}
                            error={errors.passwordConfirm}
                            errorIcon={<WarningIcon className="size-3.5 shrink-0" />}
                        />
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

            {/* step:1 회원 정보 입력 폼 - 모바일 */}
            {step === 1 && variant === 'mobile' && (
                <form noValidate onSubmit={handleSubmit} className="flex flex-col">
                    {/* 이름 & 닉네임 영역 */}
                    <div className="mb-4 grid grid-cols-2 gap-2">
                        <div>
                            <label htmlFor="signup-name" className="mb-1.5 block text-mobile-body font-bold text-gray-700">
                                이름 <span className="text-red-700">*</span>
                            </label>
                            <FormInput
                                id="signup-name"
                                name="name"
                                type="text"
                                required
                                autoComplete="name"
                                maxLength={30}
                                placeholder="이름을 입력해주세요"
                                value={formData.name}
                                onChange={handleChange('name')}
                                error={errors.name}
                                errorIcon={<WarningIcon className="size-3.5 shrink-0" />}
                            />
                        </div>
                        <div>
                            <label htmlFor="signup-nickname" className="mb-1.5 block text-mobile-body font-bold text-gray-700">
                                닉네임 <span className="text-red-700">*</span>
                            </label>
                            <FormInput
                                id="signup-nickname"
                                name="nickname"
                                type="text"
                                required
                                autoComplete="nickname"
                                maxLength={10}
                                placeholder="닉네임을 입력해주세요"
                                value={formData.nickname}
                                onChange={handleChange('nickname')}
                                error={errors.nickname}
                                errorIcon={<WarningIcon className="size-3.5 shrink-0" />}
                            />
                        </div>
                    </div>

                    {/* 이메일 영역 */}
                    <div className="mb-4">
                        <label htmlFor="signup-email" className="mb-1.5 block text-mobile-body font-bold text-gray-700">
                            이메일 <span className="text-red-700">*</span>
                        </label>
                        <FormInput
                            id="signup-email"
                            name="email"
                            type="email"
                            required
                            autoComplete="email"
                            maxLength={100}
                            placeholder="이메일 주소를 입력해주세요"
                            value={formData.email}
                            onChange={handleChange('email')}
                            error={errors.email}
                            errorIcon={<WarningIcon className="size-3.5 shrink-0" />}
                        />
                    </div>

                    {/* 비밀번호 영역 */}
                    <div className="mb-4">
                        <label htmlFor="signup-password" className="mb-1.5 block text-mobile-body font-bold text-gray-700">
                            비밀번호 <span className="text-red-700">*</span>
                        </label>
                        <FormInput
                            id="signup-password"
                            name="password"
                            type="password"
                            required
                            autoComplete="new-password"
                            maxLength={16}
                            placeholder="영문 대소문자, 숫자 포함 8~16자"
                            value={formData.password}
                            onChange={handleChange('password')}
                            error={errors.password}
                            errorIcon={<WarningIcon className="size-3.5 shrink-0" />}
                        />
                    </div>

                    {/* 비밀번호 확인 영역 */}
                    <div className="mb-5">
                        <label htmlFor="signup-password-confirm" className="mb-1.5 block text-mobile-body font-bold text-gray-700">
                            비밀번호 확인 <span className="text-red-700">*</span>
                        </label>
                        <FormInput
                            id="signup-password-confirm"
                            name="passwordConfirm"
                            type="password"
                            required
                            autoComplete="new-password"
                            maxLength={16}
                            placeholder="비밀번호를 다시 입력해주세요"
                            value={formData.passwordConfirm}
                            onChange={handleChange('passwordConfirm')}
                            error={errors.passwordConfirm}
                            errorIcon={<WarningIcon className="size-3.5 shrink-0" />}
                        />
                    </div>

                    {/* 약관 동의 체크박스 */}
                    <div className="flex items-center gap-2">
                        <CheckboxGroup
                            name="terms"
                            required
                            value={agreedTerms}
                            onChange={onAgreedTermsChange}
                            options={[
                                {
                                value: 'terms',
                                label: (
                                    <span className="text-mobile-body font-medium text-gray-500 select-none">
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

                    {/* 로그인 링크 + 회원가입 버튼 */}
                    <div className="fixed inset-x-0 bottom-0 z-10 flex flex-col items-center gap-2 bg-white px-4 pb-[calc(8px+env(safe-area-inset-bottom))] pt-3">
                        <div className="flex justify-center gap-2 text-mobile-body font-medium">
                            <span className="text-gray-500">이미 계정이 있으신가요?</span>
                            <Link to="/login" className="text-primary-500 underline">로그인</Link>
                        </div>
                        <Button
                            type="submit"
                            variant="primary"
                            size="md"
                            disabled={!isAgree}
                            className="h-11 w-full text-mobile-body font-bold"
                        >
                            가입 및 인증 메일 받기
                        </Button>
                    </div>
                </form>
            )}

            {/* step:2 이메일 인증 코드 입력 폼 - 모바일 */}
            {step === 2 && variant === 'mobile' && (
                <div className="flex w-full flex-col">
                    {/* 브랜드 및 안내 영역 */}
                    <div className="mb-5 flex flex-col items-start gap-1.5">
                        <div className="flex items-end gap-1.5">
                            <div className="flex h-[27px] w-6 items-center justify-center">
                                <Logo className="h-full w-full" />
                            </div>
                            <span className="font-logo text-[20px] tracking-[0.8px] text-gray-900">같이살림</span>
                        </div>
                        <p className="text-mobile-label font-medium text-gray-600">인증 메일을 보냈어요</p>
                        <p className="text-mobile-label font-medium text-gray-600">
                            입력한 이메일로 전송된 인증번호를 확인해주세요.
                        </p>
                    </div>

                    <form noValidate onSubmit={onFinalSubmit} className="flex w-full flex-col">
                        {/* 이메일 확인 영역 */}
                        <div className="mb-4 w-full">
                            <label htmlFor="signup-confirm-email" className="mb-1.5 block text-mobile-body font-bold text-gray-700">이메일</label>
                            <FormInput
                                id="signup-confirm-email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                value={formData.email}
                                readOnly
                                disabled
                                className="cursor-not-allowed border-transparent bg-gray-100 text-gray-400"
                            />
                        </div>

                        {/* 인증번호 입력 및 인증 버튼 영역 */}
                        <div className="w-full">
                            <label htmlFor="signup-verification-code" className="mb-1.5 block text-mobile-body font-bold text-gray-700">인증번호</label>
                            <div className="flex w-full gap-2">
                                <div className="flex-1">
                                    <FormInput
                                        id="signup-verification-code"
                                        name="verificationCode"
                                        type="text"
                                        required
                                        autoComplete="one-time-code"
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
                                    className="h-[50px] min-w-[84px] shrink-0"
                                >
                                    인증
                                </Button>
                            </div>
                        </div>

                        {/* 인증번호 다시 보내기 */}
                        <div className="mb-5 flex justify-end pt-1.5">
                            <button
                                type="button"
                                onClick={onResendCode}
                                disabled={isVerified || isResending}
                                className="text-mobile-label font-medium text-primary-500 underline disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {isResending ? '전송 중...' : '인증번호 다시 보내기'}
                            </button>
                        </div>

                        {/* 최종 회원가입 버튼 */}
                        <Button
                            type="submit"
                            variant="primary"
                            size="md"
                            disabled={!isVerified}
                            className="h-11 w-full text-mobile-body font-bold"
                        >
                            회원가입
                        </Button>
                    </form>
                </div>
            )}

            {/* step:2 이메일 인증 코드 입력 폼 - 데스크톱 */}
            {step === 2 && variant === 'desktop' && (
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
                            <label htmlFor="signup-confirm-email" className="mb-2 block text-base font-bold text-gray-800">이메일</label>
                            <FormInput
                                id="signup-confirm-email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                value={formData.email}
                                readOnly
                                disabled
                                className="cursor-not-allowed border-transparent bg-gray-100 text-gray-400"
                            />
                        </div>

                        {/* 인증번호 입력 및 인증 버튼 영역 */}
                        <div className='mb-5 w-full'>
                            <label htmlFor="signup-verification-code" className="mb-2 block text-base font-bold text-gray-800">인증번호</label>
                            <div className='flex w-full gap-2'>
                                <div className='flex-1'>
                                    <FormInput
                                        id="signup-verification-code"
                                        name="verificationCode"
                                        type="text"
                                        required
                                        autoComplete="one-time-code"
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

                        {/* 인증번호 다시 보내기 */}
                        <div className="mb-5 flex justify-end">
                            <button
                                type="button"
                                onClick={onResendCode}
                                disabled={isVerified || isResending}
                                className="text-sm font-medium text-primary-500 underline disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {isResending ? '전송 중...' : '인증번호 다시 보내기'}
                            </button>
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
