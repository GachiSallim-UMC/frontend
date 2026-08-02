import { useState } from "react";
import type { FormEvent } from "react";
import { FormInput, Button } from "@/shared/components"


interface SendingEmailFormProps {
    onSubmit?: (email: string) => void;
}

export const SendingEmailForm = ({onSubmit}: SendingEmailFormProps) => {
    const [email, setEmail] = useState("");
    const [error, setError] = useState<string>();

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

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

        if (onSubmit) {
            onSubmit(normalizedEmail);
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
                    className="w-full h-14 font-bold"
                >
                재설정 링크 보내기  
                </Button>
            </div>
        </form>
    )
}
