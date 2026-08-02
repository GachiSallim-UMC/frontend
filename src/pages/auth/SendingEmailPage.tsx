import { Link, useNavigate } from 'react-router-dom'
import { SendingEmailForm } from "@/features/auth"

export const SendingEmailPage = () => {
    const navigate = useNavigate();

    const handleSubmit = (email: string) => {
        navigate('/find-password/sent', { state: {email} });
    }
    return (
        // 배경
        <div className="flex min-h-screen items-center justify-center bg-primary-100">
            {/* 흰 색 카드 */}
            <div className="w-full h-[696px] max-w-lg rounded-3xl bg-white px-10 pt-10 pb-8">
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
    )
}