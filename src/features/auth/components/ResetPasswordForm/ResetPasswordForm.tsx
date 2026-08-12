import type { ChangeEvent, FormEvent } from 'react';
import type { ResetPasswordFormData } from '@/features/auth/types/auth.type';
import { FormInput } from '@/shared/components/form';
import { Button } from '@/shared/components/ui';
import WarningIcon from "@/assets/icons/login/warning.svg?react"

interface ResetPasswordFormProps {
    formData: ResetPasswordFormData;
    onChange: (field: keyof ResetPasswordFormData) => (e: ChangeEvent<HTMLInputElement>) => void;
    onSubmit: (e: FormEvent) => void;
    isLoading?: boolean;
}

export const ResetPasswordForm = ({
    formData,
    onChange,
    onSubmit,
    isLoading = false,
}: ResetPasswordFormProps) => {
    
    // 안내 문구(영문 대문자·소문자·숫자 포함 8~16자)와 동일한 기준으로 검증 후 일치할 때만 버튼 활성화
    const passwordComplexityRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).+$/;
    const isSubmitEnabled =
        formData.newPassword.length >= 8 &&
        formData.newPassword.length <= 16 &&
        passwordComplexityRegex.test(formData.newPassword) &&
        formData.newPassword === formData.newPasswordConfirm;

    return (
        <form onSubmit={onSubmit} className="flex w-full flex-col">
            <div className="mb-4">
                <label htmlFor="new-password" className="mb-1.5 block text-mobile-body font-bold text-gray-700 lg:mb-2 lg:text-base lg:text-gray-800">
                    새 비밀번호 <span className="text-red-700">*</span>
                </label>
                <FormInput
                    id="new-password"
                    name="newPassword"
                    type="password"
                    required
                    autoComplete="new-password"
                    placeholder="비밀번호를 입력해주세요"
                    value={formData.newPassword}
                    onChange={onChange('newPassword')}
                    disabled={isLoading}
                    errorIcon={<WarningIcon className="size-3.5 shrink-0" />}
                />
                <p className="mt-1.5 text-mobile-caption text-gray-500 lg:mt-1 lg:text-base lg:text-gray-400">
                    * 영문 대문자·소문자·숫자를 포함한 8~16자의 비밀번호 입력
                </p>
            </div>

            <div className="mb-5 lg:mb-8">
                <label htmlFor="new-password-confirm" className="mb-1.5 block text-mobile-body font-bold text-gray-700 lg:mb-2 lg:text-base lg:text-gray-800">
                    비밀번호 재입력 <span className="text-red-700">*</span>
                </label>
                <FormInput
                    id="new-password-confirm"
                    name="newPasswordConfirm"
                    type="password"
                    required
                    autoComplete="new-password"
                    placeholder="비밀번호를 다시 입력해주세요"
                    value={formData.newPasswordConfirm}
                    onChange={onChange('newPasswordConfirm')}
                    disabled={isLoading}
                    errorIcon={<WarningIcon className="size-3.5 shrink-0" />}
                />
            </div>

            <Button
                type="submit"
                variant="primary"
                size="md"
                disabled={!isSubmitEnabled || isLoading}
                className="h-11 w-full text-mobile-body font-bold transition-colors lg:h-auto lg:rounded-xl lg:py-4 lg:text-base"
            >
                {isLoading ? '재설정 중...' : '비밀번호 재설정'}
            </Button>
        </form>
    );
};
