import { useState } from 'react';
import type { FormEvent } from 'react';
import { FormInput } from '@/shared/components/form/FormInput/FormInput';
import { Button } from '@/shared/components/ui/Button/Button';
import EyeOnIcon from '@/assets/icons/login/eye-on.svg?react';
import EyeOffIcon from '@/assets/icons/login/eye-off.svg?react';

interface LoginFormProps {
    onSubmit?: (e: FormEvent) => void;
}

export const LoginForm = ({onSubmit}: LoginFormProps) => {
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        if (onSubmit) {
            onSubmit(e);
        }
    };

    return  (
        <div className="flex w-full flex-col">
            <form onSubmit={handleSubmit} className= "flex flex-col">
                {/* 이메일 입력 영역*/}
                <div>
                    <label className="mb-2 block text-base font-bold text-gray-800">이메일</label>
                    <FormInput
                        type="email"
                        placeholder="이메일 주소를 입력해주세요"
                        className="text-base text-gray-500"
                    />
                </div>
                <div>
                    <label className="mt-4 mb-2 block text-base font-bold text-gray-800">비밀번호</label>
                    <FormInput
                        type={showPassword ? "text" : "password"}
                        placeholder="비밀번호를 입력해주세요"
                        className="text-base text-gray-500"

                        rightAddon={
                            <button 
                                type="submit"
                                onClick={() => setShowPassword(!showPassword)}
                                className="flex h-5 w-5 items-center justify-center"
                                aria-label={showPassword ? "비밀번호 숨기기" : "비밀번호 표시"}
                            >
                                {showPassword ? <EyeOffIcon /> : <EyeOnIcon />}
                            </button>
                        }
                    />
                </div>

                <Button 
                    type="submit"
                    variant="primary"
                    size="md"
                    className="mt-5 mb-5 w-full h-14 font-bold"
                >
                    로그인
                </Button>
            </form>
        </div>
    )
}