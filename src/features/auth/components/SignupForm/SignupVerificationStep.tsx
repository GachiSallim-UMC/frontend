import type { ChangeEvent, FormEvent, SyntheticEvent } from 'react';
import CircleIcon from '@/assets/icons/login/findingPassword/circle.svg?react';
import MailIcon from '@/assets/icons/login/findingPassword/mail.svg?react';
import Logo from '@/assets/mobile-logo.svg?react';
import { FormInput } from '@/shared/components/form';
import { Button } from '@/shared/components/ui';
import type { SignupFormData, SignupFormErrors } from '@/features/auth/types/auth.type';

interface SignupVerificationStepProps {
  variant: 'mobile' | 'desktop';
  formData: SignupFormData;
  errors: SignupFormErrors;
  isCodeError: boolean;
  isVerified: boolean;
  isResending?: boolean;
  onFieldChange: (field: keyof SignupFormData) => (event: ChangeEvent<HTMLInputElement>) => void;
  onConfirmEmail: (event: SyntheticEvent) => void;
  onFinalSubmit: (event: FormEvent) => void;
  onResendCode?: () => void;
}

export const SignupVerificationStep = ({
  variant,
  formData,
  errors,
  isCodeError,
  isVerified,
  isResending,
  onFieldChange,
  onConfirmEmail,
  onFinalSubmit,
  onResendCode,
}: SignupVerificationStepProps) => {
  const isMobile = variant === 'mobile';
  const labelClassName = isMobile
    ? 'mb-1.5 block text-mobile-body font-bold text-gray-700'
    : 'mb-2 block text-base font-bold text-gray-800';

  return (
    <div className="flex w-full flex-col">
      {isMobile ? (
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
      ) : (
        <>
          <div className="relative mb-5 flex items-center justify-center">
            <CircleIcon className="h-18 w-18" />
            <MailIcon className="absolute left-1/2 top-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2" />
          </div>
          <div className="mb-5 text-center">
            <h1 className="mb-1 text-2xl font-bold text-gray-900">인증 메일을 보냈어요</h1>
            <p className="text-sm font-medium text-gray-600">
              입력한 이메일로 전송된 인증번호를 확인해주세요.
            </p>
          </div>
        </>
      )}

      <form noValidate onSubmit={onFinalSubmit} className="flex w-full flex-col">
        <div className="mb-4 w-full">
          <label htmlFor="signup-confirm-email" className={labelClassName}>
            이메일
          </label>
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

        <div className={isMobile ? 'w-full' : 'mb-5 w-full'}>
          <label htmlFor="signup-verification-code" className={labelClassName}>
            인증번호
          </label>
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
                onChange={onFieldChange('verificationCode')}
                error={
                  errors.verificationCode ||
                  (isCodeError ? '인증번호가 일치하지 않습니다.' : undefined)
                }
                className="w-full"
              />
            </div>
            <Button
              type="button"
              onClick={onConfirmEmail}
              variant="primary"
              disabled={isVerified}
              className={isMobile ? 'h-[50px] min-w-[84px] shrink-0' : 'shrink-0'}
            >
              인증
            </Button>
          </div>
        </div>

        <div className={isMobile ? 'mb-5 flex justify-end pt-1.5' : 'mb-5 flex justify-end'}>
          <button
            type="button"
            onClick={onResendCode}
            disabled={isVerified || isResending}
            className={`${isMobile ? 'text-mobile-label' : 'text-sm'} font-medium text-primary-500 underline disabled:cursor-not-allowed disabled:opacity-50`}
          >
            {isResending ? '전송 중...' : '인증번호 다시 보내기'}
          </button>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="md"
          disabled={!isVerified}
          className={
            isMobile
              ? 'h-11 w-full text-mobile-body font-bold'
              : `w-full rounded-xl py-4 text-base font-bold transition-colors ${
                  isCodeError
                    ? 'cursor-not-allowed border-none bg-gray-300 text-white hover:bg-gray-300'
                    : 'bg-primary-500 text-white hover:bg-primary-600'
                }`
          }
        >
          회원가입
        </Button>
      </form>
    </div>
  );
};
