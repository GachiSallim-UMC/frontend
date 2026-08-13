import { useState } from 'react';
import type { FormEvent } from 'react';
import { FormInput } from '@/shared/components/form';
import { Button } from '@/shared/components/ui';
import EyeOnIcon from '@/assets/icons/login/eye-on.svg?react';
import EyeOffIcon from '@/assets/icons/login/eye-off.svg?react';
import MailIcon from '@/assets/icons/login/mail.svg?react';
import LockIcon from '@/assets/icons/login/lock.svg?react';

interface LoginFormProps {
    onSubmit?: (credentials: { email: string; password: string }) => void;
    isSubmitting?: boolean;
    errorMessage?: string;
}

export const LoginForm = ({ onSubmit, isSubmitting = false, errorMessage }: LoginFormProps) => {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState<Partial<Record<'email' | 'password', string>>>({});

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        const nextErrors: typeof errors = {};
        if (!email.trim()) nextErrors.email = '이메일을 입력해 주세요.';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
            nextErrors.email = '올바른 이메일 형식으로 입력해 주세요.';
        }
        if (!password) nextErrors.password = '비밀번호를 입력해 주세요.';
        setErrors(nextErrors);
        if (Object.keys(nextErrors).length > 0) return;
        onSubmit?.({ email, password });
    };

    return  (
        <div className="flex w-full flex-col">
            <form noValidate onSubmit={handleSubmit} className= "flex flex-col">
                {/* 이메일 입력 영역*/}
                <div>
                    <label htmlFor="login-email" className="mb-2 block text-mobile-body font-bold text-gray-700 lg:text-base lg:text-gray-800">이메일</label>
                    <FormInput
                        id="login-email"
                        name="email"
                        type="email"
                        required
                        autoComplete="username"
                        placeholder="이메일 주소를 입력해주세요"
                        value={email}
                        onChange={e => {
                            setEmail(e.target.value);
                            setErrors(previous => ({ ...previous, email: undefined }));
                        }}
                        error={errors.email}
                        leftAddon={<MailIcon className="h-[18px] w-[18px]" />}
                    />
                </div>

                <div>
                    <label htmlFor="login-password" className="mt-4 mb-2 block text-mobile-body font-bold text-gray-700 lg:text-base lg:text-gray-800">비밀번호</label>
                    <FormInput
                        id="login-password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        required
                        autoComplete="current-password"
                        placeholder="비밀번호를 입력해주세요"
                        value={password}
                        onChange={e => {
                            setPassword(e.target.value);
                            setErrors(previous => ({ ...previous, password: undefined }));
                        }}
                        error={errors.password}
                        leftAddon={<LockIcon className="h-[18px] w-[18px]" />}
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
                    className="mt-4 mb-5 h-11 w-full text-mobile-body font-bold lg:h-14 lg:text-button"
                >
                    로그인
                </Button>
                {errorMessage && (
                    <p className="-mt-3 mb-3 text-center text-mobile-label text-red-500 lg:text-sm">{errorMessage}</p>
                )}
            </form>
        </div>
    )
}
