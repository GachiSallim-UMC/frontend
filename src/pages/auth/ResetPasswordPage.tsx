import { useState, useEffect, type FormEvent } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ResetPasswordForm, authApi, type ResetPasswordFormData } from '@/features/auth';
import { useAlertStore } from '@/shared/store/useAlertStore';

export const ResetPasswordPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const showAlert = useAlertStore(state => state.showAlert);
    
    const [isLoading, setIsLoading] = useState(false);
    const [urlParams, setUrlParams] = useState({ email: '', code: '' });
    
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
            showAlert({
                title: '유효하지 않은 접근',
                message: '비밀번호 재설정 링크가 올바르지 않거나 만료되었습니다.'
            });
            navigate('/login', { replace: true });
        }
    }, [location, navigate, showAlert]);

    const handleFormDataChange = (field: keyof ResetPasswordFormData) => 
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setFormData(prev => ({ ...prev, [field]: e.target.value }));
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (formData.newPassword !== formData.newPasswordConfirm) {
            showAlert({
                title: '비밀번호 오류',
                message: '새 비밀번호가 일치하지 않습니다. 다시 확인해 주세요.'
            });
            return;
        }

        setIsLoading(true);

        try {
            await authApi.resetPassword({
                email: urlParams.email,
                confirmationCode: urlParams.code,
                newPassword: formData.newPassword
            });

            showAlert({
                title: '완료',
                message: '비밀번호가 성공적으로 재설정되었습니다. 다시 로그인해 주세요.',
                tone: 'success',
            });
            navigate('/login', { replace: true });

        } catch (error: unknown) {
            let errorMessage = '비밀번호 재설정 중 오류가 발생했습니다.';

            if (error instanceof Error) {
                const e = error as Error & { response?: { data?: { message?: string } } };
                errorMessage = e.response?.data?.message || e.message;
            }

            showAlert({
                title: '재설정 실패',
                message: errorMessage
            });
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
                    onSubmit={handleSubmit}
                    isLoading={isLoading}
                />
            </div>
        </div>
    );
};