import { useState } from 'react';
import type { FormEvent } from 'react';
import { FormInput } from '@/shared/components/form';
import { Button } from '@/shared/components/ui';
import EyeOnIcon from '@/assets/icons/login/eye-on.svg?react';
import EyeOffIcon from '@/assets/icons/login/eye-off.svg?react';

interface LoginFormProps {
    onSubmit?: (credentials: { email: string; password: string }) => void;
    isSubmitting?: boolean;
    errorMessage?: string;
}

export const LoginForm = ({ onSubmit, isSubmitting = false, errorMessage }: LoginFormProps) => {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        onSubmit?.({ email, password });
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
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                    />
                </div>
                
                <div>
                    <label className="mt-4 mb-2 block text-base font-bold text-gray-800">비밀번호</label>
                    <FormInput
                        type={showPassword ? "text" : "password"}
                        placeholder="비밀번호를 입력해주세요"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        required

                        rightAddon={
                            <button
                                type="button"
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
                    isLoading={isSubmitting}
                    className="mt-5 mb-5 w-full h-14 font-bold"
                >
                    로그인
                </Button>
                {errorMessage && (
                    <p className="-mt-3 mb-3 text-center text-sm text-red-500">{errorMessage}</p>
                )}
            </form>
        </div>
    )
}
