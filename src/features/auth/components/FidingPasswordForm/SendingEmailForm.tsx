import { FormEvent, useState } from "react";
import { FormInput, Button } from "@/shared/components"


interface SendingEmailProps {
    onSubmit?: (email: string) => void;
}

export const SendingEmailForm = ({onSubmit}: SendingEmailProps) => {
    const [email, setEmail] = useState("")
    ;
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        if (onSubmit) {
            onSubmit(email);
        }
    };

    return (
        <form onSubmit={handleSubmit} className= "flex flex-col">
            <div className="flex flex-col">
                <h1 className="mb-2 text-button font-bold text-gray-800">이메일</h1>
                <FormInput
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="이메일 주소를 입력해주세요"
                    className="mb-5 text-base text-gray-500"
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