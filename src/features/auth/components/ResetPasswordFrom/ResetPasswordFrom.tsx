import type { ChangeEvent, FormEvent } from 'react';
import { FormInput } from '@/shared/components'; 
import { Button } from '@/shared/components';      
import type { ResetPasswordFormData } from '@/features/auth/types/auth.type';

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
    
    // 새 비밀번호 길이 8자 이상, 새 비밀번호와 재입력 일치 시 버튼 활성화
    const isSubmitEnabled = 
        formData.newPassword.length >= 8 && 
        formData.newPassword === formData.newPasswordConfirm;

    return (
        <div className="flex w-full flex-col">
            <div className="mb-8 flex flex-col items-center">
                <h1 className="font-logo text-3xl font-medium tracking-wider text-gray-900">
                    같이살림
                </h1>
                <p className="text-sm font-medium text-gray-600 mt-2">
                    비밀번호 재설정
                </p>
            </div>

            <form onSubmit={onSubmit} className="flex flex-col">
                <p className="mb-6 text-sm font-medium text-gray-500 break-keep leading-relaxed text-center bg-gray-50 p-3 rounded-lg">
                    비밀번호는 영문 대문자, 소문자, 숫자를 포함한 <br />
                    8~16자의 문자열로 이루어져야 합니다.
                </p>

                <div className="mb-4">
                    <label className="mb-2 block text-base font-bold text-gray-800">새 비밀번호</label>
                    <FormInput
                        type="password"
                        placeholder="새 비밀번호를 입력해주세요"
                        value={formData.newPassword}
                        onChange={onChange('newPassword')}
                        disabled={isLoading}
                    />
                </div>

                <div className="mb-8">
                    <label className="mb-2 block text-base font-bold text-gray-800">비밀번호 재입력</label>
                    <FormInput
                        type="password"
                        placeholder="새 비밀번호를 다시 입력해주세요"
                        value={formData.newPasswordConfirm}
                        onChange={onChange('newPasswordConfirm')}
                        disabled={isLoading}
                    />
                </div>

                <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    disabled={!isSubmitEnabled || isLoading}
                    className="w-full rounded-xl py-4 text-base font-bold transition-colors"
                >
                    {isLoading ? '재설정 중...' : '비밀번호 재설정'}
                </Button>
            </form>
        </div>
    );
};