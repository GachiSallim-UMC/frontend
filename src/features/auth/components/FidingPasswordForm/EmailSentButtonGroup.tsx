import { useState } from "react";
import { Button } from "@/shared/components";
import { authApi } from "@/features/auth/api/auth.api"
import { useErrorStore } from "@/shared/store";

interface EmailSentButtonGroupProps {
    email: string;
    onNextStep?: () => void;
}

export const EmailSentButtonGroup = ({email, onNextStep}: EmailSentButtonGroupProps) => {
    const [isResending, setIsResending] = useState(false);
    const showError = useErrorStore((state) => state.showError);

    const handleResendEmail = async () => {
        if (isResending) return;
        setIsResending(true);

        try {
            await authApi.forgotPassword({ email });
            alert('메일을 다시 보냈습니다. 메일함을 확인해 주세요.');
        } catch (error: any) {
            showError({
                title: '재전송 실패',
                message: error.response?.data?.message || error.message || '메일 재전송에 실패했습니다. 잠시 후 다시 시도해 주세요.',
            });
        } finally {
            setIsResending(false);
        }
    };
    
    return (
        <div className="flex w-full flex-col items-center gap-3">
            <Button
                variant="outline"
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