import { useState, useEffect, type FormEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ResetPasswordForm, authApi, type ResetPasswordFormData } from '@/features/auth';
import { useErrorStore } from '@/shared/store/useErrorStore';
import { ConfirmModal } from '@/shared/components/ui';
import LockIcon from "@/assets/icons/login/lock.svg?react"

export const ResetPasswordPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const showError = useErrorStore(state => state.showError);

    const [isLoading, setIsLoading] = useState(false);
    const [urlParams, setUrlParams] = useState({ email: '', code: '' });
    const [isResetModalOpen, setIsResetModalOpen] = useState(false);
    const [resetError, setResetError] = useState<string | undefined>(undefined);
    
    const [formData, setFormData] = useState<ResetPasswordFormData>({
        newPassword: '',
        newPasswordConfirm: '',
    });

    useEffect(() => {
        const searchString = location.search || location.hash.replace('#', '?');
        const params = new URLSearchParams(searchString);
        
        const email = params.get('email');
        const code = params.get('code');

        if (email && code) {
            setUrlParams({ email, code });
        } else {
            showError({
                title: '유효하지 않은 접근',
                message: '비밀번호 재설정 링크가 올바르지 않거나 만료되었습니다.'
            });
            navigate('/login', { replace: true });
        }
    }, [location, navigate, showError]);

    const handleFormDataChange = (field: keyof ResetPasswordFormData) => 
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setFormData(prev => ({ ...prev, [field]: e.target.value }));
    };

    const handleSubmitClick = (e: FormEvent) => {
        e.preventDefault();

        if (formData.newPassword !== formData.newPasswordConfirm) {
            showError({
                title: '비밀번호 오류',
                message: '새 비밀번호가 일치하지 않습니다. 다시 확인해 주세요.'
            });
            return;
        }

        setResetError(undefined);
        setIsResetModalOpen(true);
    };

    const handleConfirmReset = async () => {
        setIsLoading(true);

        try {
            await authApi.resetPassword({
                email: urlParams.email,
                confirmationCode: urlParams.code,
                newPassword: formData.newPassword
            });

            setIsResetModalOpen(false);
            navigate('/login', { replace: true });

        } catch (error: unknown) {
            let errorMessage = '비밀번호 재설정 중 오류가 발생했습니다.';

            if (error instanceof Error) {
                const e = error as Error & { response?: { data?: { message?: string } } };
                errorMessage = e.response?.data?.message || e.message;
            }

            setResetError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-primary-100">
            <div className="h-[696px] w-full max-w-lg rounded-3xl bg-white px-10 pb-8 pt-10 flex flex-col">
                <ResetPasswordForm
                    formData={formData}
                    onChange={handleFormDataChange}
                    onSubmit={handleSubmitClick}
                    isLoading={isLoading}
                />
            </div>

            <ConfirmModal
                isOpen={isResetModalOpen}
                onClose={() => setIsResetModalOpen(false)}
                onConfirm={handleConfirmReset}
                icon={<LockIcon className="size-6" />}
                title="비밀번호를 재설정할까요?"
                description="입력한 새 비밀번호로 재설정합니다."
                confirmLabel="재설정하기"
                isPending={isLoading}
                errorMessage={resetError}
            />
        </div>
    );
};