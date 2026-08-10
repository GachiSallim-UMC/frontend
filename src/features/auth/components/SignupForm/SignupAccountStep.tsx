import type { ChangeEvent, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import WarningIcon from '@/assets/icons/login/warning.svg?react';
import { CheckboxGroup, FormInput } from '@/shared/components/form';
import { Button } from '@/shared/components/ui';
import type { SignupFormData, SignupFormErrors } from '@/features/auth/types/auth.type';

interface SignupAccountStepProps {
  variant: 'mobile' | 'desktop';
  formData: SignupFormData;
  errors: SignupFormErrors;
  agreedTerms: string[];
  onAgreedTermsChange: (value: string[]) => void;
  onFieldChange: (field: keyof SignupFormData) => (event: ChangeEvent<HTMLInputElement>) => void;
  onSubmit?: (event: FormEvent) => void;
}

const RequiredMark = () => <span className="text-red-700">*</span>;

export const SignupAccountStep = ({
  variant,
  formData,
  errors,
  agreedTerms,
  onAgreedTermsChange,
  onFieldChange,
  onSubmit,
}: SignupAccountStepProps) => {
  const isMobile = variant === 'mobile';
  const isAgree = agreedTerms.includes('terms');
  const labelClassName = isMobile
    ? 'mb-1.5 block text-mobile-body font-bold text-gray-700'
    : 'mb-2 block text-base font-bold text-gray-800';

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    onSubmit?.(event);
  };

  const form = (
    <form noValidate onSubmit={handleSubmit} className="flex flex-col">
      <div className={`mb-4 grid grid-cols-2 ${isMobile ? 'gap-2' : 'gap-4'}`}>
        <div>
          <label htmlFor="signup-name" className={labelClassName}>
            이름 {isMobile && <RequiredMark />}
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
            onChange={onFieldChange('name')}
            error={errors.name}
            errorIcon={<WarningIcon className="size-3.5 shrink-0" />}
          />
        </div>
        <div>
          <label htmlFor="signup-nickname" className={labelClassName}>
            닉네임 {isMobile && <RequiredMark />}
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
            onChange={onFieldChange('nickname')}
            error={errors.nickname}
            errorIcon={<WarningIcon className="size-3.5 shrink-0" />}
          />
        </div>
      </div>

      <div className="mb-4">
        <label htmlFor="signup-email" className={labelClassName}>
          이메일 {isMobile && <RequiredMark />}
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
          onChange={onFieldChange('email')}
          error={errors.email}
          errorIcon={<WarningIcon className="size-3.5 shrink-0" />}
        />
      </div>

      <div className="mb-4">
        <label htmlFor="signup-password" className={labelClassName}>
          비밀번호 {isMobile && <RequiredMark />}
        </label>
        <FormInput
          id="signup-password"
          name="password"
          type="password"
          required
          autoComplete="new-password"
          maxLength={16}
          placeholder={isMobile ? '영문 대소문자, 숫자 포함 8~16자' : '비밀번호를 입력해주세요'}
          value={formData.password}
          onChange={onFieldChange('password')}
          error={errors.password}
          errorIcon={<WarningIcon className="size-3.5 shrink-0" />}
        />
      </div>

      <div className={isMobile ? 'mb-5' : 'mb-4'}>
        <label htmlFor="signup-password-confirm" className={labelClassName}>
          비밀번호 확인 {isMobile && <RequiredMark />}
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
          onChange={onFieldChange('passwordConfirm')}
          error={errors.passwordConfirm}
          errorIcon={<WarningIcon className="size-3.5 shrink-0" />}
        />
      </div>

      <div className={isMobile ? 'flex items-center gap-2' : 'mb-5 flex items-center gap-2'}>
        <CheckboxGroup
          name="terms"
          required
          value={agreedTerms}
          onChange={onAgreedTermsChange}
          options={[
            {
              value: 'terms',
              label: (
                <span
                  className={
                    isMobile
                      ? 'select-none text-mobile-body font-medium text-gray-500'
                      : 'select-none text-base font-medium text-gray-500'
                  }
                >
                  <Link
                    to="/terms"
                    state={{ formData }}
                    className="text-primary-500 hover:underline"
                  >
                    이용약관
                  </Link>{' '}
                  및{' '}
                  <Link
                    to="/privacy"
                    state={{ formData }}
                    className="text-primary-500 hover:underline"
                  >
                    개인정보처리방침
                  </Link>
                  에 동의합니다.
                </span>
              ),
            },
          ]}
        />
      </div>

      {isMobile ? (
        <div className="fixed inset-x-0 bottom-0 z-10 flex flex-col items-center gap-2 bg-white px-4 pb-[calc(8px+env(safe-area-inset-bottom))] pt-3">
          <div className="flex justify-center gap-2 text-mobile-body font-medium">
            <span className="text-gray-500">이미 계정이 있으신가요?</span>
            <Link to="/login" className="text-primary-500 underline">
              로그인
            </Link>
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
      ) : (
        <Button type="submit" variant="primary" size="md" disabled={!isAgree}>
          가입 및 인증 메일 받기
        </Button>
      )}
    </form>
  );

  if (isMobile) return form;

  return (
    <div className="flex flex-col">
      <div className="mb-5 flex flex-col items-center">
        <h1 className="font-logo text-3xl font-medium tracking-wider text-gray-900">같이살림</h1>
        <p className="text-sm font-medium text-gray-600">새 계정 만들기</p>
      </div>
      {form}
    </div>
  );
};
