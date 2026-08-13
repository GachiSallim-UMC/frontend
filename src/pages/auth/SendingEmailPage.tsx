import { Link, useNavigate } from 'react-router-dom'
import { SendingEmailForm } from "@/features/auth"
import Logo from "@/assets/mobile-logo.svg?react";
import ArrowIcon from '@/assets/icons/login/chevron-left.svg?react'


export const SendingEmailPage = () => {
    const navigate = useNavigate();

    const handleSubmit = (email: string) => {
        navigate('/find-password/sent', { state: {email} });
    }
    return (
        <>
            {/* 모바일 전용 화면 */}
            <div className="flex min-h-dvh flex-col bg-white lg:hidden">
                <header className="sticky top-0 z-10 flex h-[52px] shrink-0 items-center justify-center border-b border-gray-100 bg-white px-4">
                    <button
                        type="button"
                        aria-label="뒤로 가기"
                        onClick={() => navigate('/login')}
                        className="absolute left-4 flex size-6 items-center justify-center text-gray-900"
                    >
                        <ArrowIcon className="size-6" strokeWidth={1.5} />
                    </button>
                    <h1 className="text-mobile-title font-bold tracking-[0.04em] text-gray-900">비밀번호 찾기</h1>
                </header>

                <div className="flex-1 px-4 pt-5">
                    <div className="mb-5 flex flex-col items-start gap-1">
                        <div className="flex items-end gap-1.5">
                            <div className="flex h-[27px] w-6 items-center justify-center">
                                <Logo className="h-full w-full" />
                            </div>
                            <span className="font-logo text-lg tracking-wider text-gray-900">같이살림</span>
                        </div>
                        <p className="text-mobile-label font-medium text-gray-600">비밀번호 찾기</p>
                        <p className="text-mobile-label font-medium leading-relaxed text-gray-600">
                            가입하신 이메일 주소를 입력하시면 비밀번호를 재설정할 수 있는 링크를 보내드립니다.
                        </p>
                    </div>

                    <SendingEmailForm onSubmit={handleSubmit} />

                    <div className="mt-4 flex justify-center">
                        <Link to="/login" className="text-mobile-body font-medium text-gray-500">
                            로그인으로 돌아가기
                        </Link>
                    </div>
                </div>
            </div>

            {/* 데스크톱 전용 화면 */}
            <div className="hidden min-h-screen items-center justify-center bg-primary-100 lg:flex">
                {/* 흰 색 카드 */}
                <div className="min-h-[696px] w-full max-w-lg rounded-3xl bg-white px-10 pt-10 pb-8">
                    <div className="flex flex-col items-center justify-center">
                        <h1 className="mb-2 font-logo font-medium text-3xl text-gray-900 tracking-wider">같이살림</h1>
                        <p className="mb-3 font-medium text-sm text-gray-600">
                            비밀번호를 잊으셨나요?
                        </p>
                        <p className="text-center text-sm text-gray-600 leading-tight">
                            가입하신 이메일 주소를 입력하시면<br />
                            비밀번호를 재설정할 수 있는 링크를 보내드립니다.
                        </p>
                    </div>

                    <SendingEmailForm onSubmit={handleSubmit}/>

                    <div className="mt-5 flex justify-center">
                        <Link to="/login" className="text-base font-medium text-primary-500 underline">
                            로그인으로 돌아가기
                        </Link>
                    </div>
                </div>
            </div>
        </>
    )
}
