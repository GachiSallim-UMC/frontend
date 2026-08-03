import { useState } from "react";
import type { FormEvent } from "react";
import { FormInput, Button } from "@/shared/components"
import { authApi } from "@/features/auth/api/auth.api"
import { useErrorStore } from "@/shared/store";

interface SendingEmailFormProps {
    onSubmit?: (email: string) => void;
}

export const SendingEmailForm = ({onSubmit}: SendingEmailFormProps) => {
    const [email, setEmail] = useState("");
    const [error, setError] = useState<string>();
    const [isSubmitting, setIsSubmitting] = useState(false);

    const showError = useErrorStore((state) => state.showError);

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (isSubmitting) return;

        const normalizedEmail = email.trim();
        if (!normalizedEmail) {
            setError('이메일을 입력해 주세요.');
            return;
        }
        if (normalizedEmail.length > 100) {
            setError('이메일은 100자 이하로 입력해 주세요.');
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
            setError('올바른 이메일 형식으로 입력해 주세요.');
            return;
        }

        setIsSubmitting(true);

        try {
            await authApi.forgotPassword({ email: normalizedEmail });
            if (onSubmit) {
                onSubmit(normalizedEmail);
            }
        } catch (error: unknown) {
            let errorMessage = '가입된 이메일을 찾을 수 없거나 발송에 실패했습니다.';
            if (error instanceof Error) {
                const e = error as Error & { response?: { data?: { message?: string } } };
                errorMessage = e.response?.data?.message || e.message;
            }

            showError({
                title: '이메일 발송 실패',
                message: errorMessage,
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form noValidate onSubmit={handleSubmit} className= "flex flex-col">
            <div className="flex flex-col">
                <h1 className="mb-2 text-button font-bold text-gray-800">이메일</h1>
                <FormInput
                    type="email"
                    value={email}
                    onChange={(e) => {
                        setEmail(e.target.value);
                        setError(undefined);
                    }}
                    maxLength={100}
                    placeholder="이메일 주소를 입력해주세요"
                    error={error}
                    containerClassName="mb-5"
                    className="text-base text-gray-500"
                />
                <Button 
                    type="submit"
                    variant="primary"
                    size="md"
                    disabled={isSubmitting}
                    className="w-full h-14 font-bold"
                >
                    {isSubmitting ? '전송 중...' : '재설정 링크 보내기'}
                </Button>
            </div>
        </form>
    )
}
