import { useLocation, Navigate, Link, useNavigate } from "react-router-dom"
import { EmailSentHeader, EmailSentButtonGroup } from "@/features/auth";
import ArrowIcon from '@/assets/icons/login/chevron-left.svg?react'

export const EmailSentPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const email = location.state?.email;

    if (!email) {
        return <Navigate to="/find-password" replace />;
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
                    <span className="text-mobile-title font-bold tracking-[0.04em] text-gray-900">비밀번호 찾기</span>
                </header>

                <div className="flex-1 px-4 pt-8">
                    <EmailSentHeader email={email} />

                    <div className="mt-8">
                        <EmailSentButtonGroup email={email} />
                    </div>

                    <div className="mt-4 flex justify-center">
                        <Link to="/login" className="text-mobile-body font-medium text-gray-500">
                            로그인으로 돌아가기
                        </Link>
                    </div>
                </div>
            </div>

            {/* 데스크톱 전용 화면 */}
            <div className="hidden min-h-screen items-center justify-center bg-primary-100 lg:flex">
                <div className="w-full h-[696px] max-w-lg rounded-3xl bg-white px-10 pt-10 pb-8">

                    <EmailSentHeader email={email} />

                    <div className="my-5 h-px w-full bg-gray-200" />

                    <EmailSentButtonGroup email={email} />

                    <div className="mt-5 flex justify-center">
                        <Link to="/login" className="text-base font-medium text-primary-500 underline">
                            로그인으로 돌아가기
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
