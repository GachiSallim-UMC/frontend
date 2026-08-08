import { useState } from "react";
import { Button } from "@/shared/components";
import { authApi } from "@/features/auth/api/auth.api"
import { useErrorStore, useSuccessStore } from "@/shared/store";
import { ApiError } from "@/shared/api";

interface EmailSentButtonGroupProps {
    email: string;
}

export const EmailSentButtonGroup = ({email}: EmailSentButtonGroupProps) => {
    const [isResending, setIsResending] = useState(false);
    const showError = useErrorStore((state) => state.showError);
    const showSuccess = useSuccessStore((state) => state.showSuccess);

    const handleResendEmail = async () => {
        if (isResending) return;
        setIsResending(true);

        try {
            await authApi.forgotPassword({ email });
            showSuccess({ title: '전송 완료', message: '메일을 다시 보냈습니다. 메일함을 확인해 주세요.' });
        } catch (error: unknown) { 
            
            // 기본 에러 메시지 설정
            let errorMessage = '메일 재전송에 실패했습니다. 잠시 후 다시 시도해 주세요.';

            // 에러 타입 확인 
            if (error instanceof ApiError) {
                // 커스텀 ApiError인 경우
                errorMessage = error.message;
            } else if (error instanceof Error) {
                const e = error as Error & { response?: { data?: { message?: string } } };
                errorMessage = e.response?.data?.message || e.message;
            }

            showError({
                title: '재전송 실패',
                message: errorMessage,
            });
        } finally {
            setIsResending(false);
        }
    };
    
    return (
        <div className="flex w-full flex-col items-center gap-3">
            <Button
                variant="primary"
                size="md"
                className="w-full font-bold"
                onClick={handleResendEmail}
                disabled={isResending}
            >
                {isResending ? '전송 중...' : '메일 다시 보내기'}
            </Button>
        </div>
    )
}