import type { ChangeEvent, FormEvent, SyntheticEvent } from 'react';
import type { SignupFormData, SignupFormErrors } from '@/features/auth/types/auth.type';
import { isUnsignedIntegerInput } from '@/shared/lib/inputValidation';
import { SignupAccountStep } from './SignupAccountStep';
import { SignupVerificationStep } from './SignupVerificationStep';

interface SignupFormProps {
  variant: 'mobile' | 'desktop';
  step: 1 | 2;
  formData: SignupFormData;
  errors: SignupFormErrors;
  onFormDataChange: (data: SignupFormData) => void;
  agreedTerms: string[];
  onAgreedTermsChange: (value: string[]) => void;
  onConfirmEmail: (event: SyntheticEvent) => void;
  onSubmit?: (event: FormEvent) => void;
  isCodeError: boolean;
  isVerified: boolean;
  isResending?: boolean;
  onFinalSubmit: (event: FormEvent) => void;
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
  const handleChange = (field: keyof SignupFormData) => (event: ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (field === 'verificationCode' && !isUnsignedIntegerInput(value)) return;
    onFormDataChange({ ...formData, [field]: value });
  };

  return (
    <div className="flex w-full flex-col">
      {step === 1 ? (
        <SignupAccountStep
          variant={variant}
          formData={formData}
          errors={errors}
          agreedTerms={agreedTerms}
          onAgreedTermsChange={onAgreedTermsChange}
          onFieldChange={handleChange}
          onSubmit={onSubmit}
        />
      ) : (
        <SignupVerificationStep
          variant={variant}
          formData={formData}
          errors={errors}
          isCodeError={isCodeError}
          isVerified={isVerified}
          isResending={isResending}
          onFieldChange={handleChange}
          onConfirmEmail={onConfirmEmail}
          onFinalSubmit={onFinalSubmit}
          onResendCode={onResendCode}
        />
      )}
    </div>
  );
};
