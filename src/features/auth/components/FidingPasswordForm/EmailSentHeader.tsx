import MailIcon from "@/assets/icons/login/findingPassword/mail.svg?react"
import CheckIcon from "@/assets/icons/login/findingPassword/check.svg?react"
import CircleIcon from "@/assets/icons/login/findingPassword/circle.svg?react"

interface EmailSentHeaderProps {
    email: string;
}

export const EmailSentHeader = ({email}: EmailSentHeaderProps) => {
    return (
        <div className="flex flex-col items-center justify-center">
            <div className="relative mb-5 items-center justify-center">
                <CircleIcon className="h-18 w-18"></CircleIcon>
                <MailIcon className="absolute top-1/2 left-1/2 h-8 w-8 -translate-x-1/2 -translate-y-1/2"></MailIcon>
            </div>
            <div className="mb-5 text-center">
                <h1 className="mb-1 text-2xl font-bold text-gray-900">이메일을 보냈어요</h1>
                <p className="text-sm font-medium text-gray-600">
                    비밀번호 재설정 링크를 보냈어요.<br />
                    메일함에서 링크를 룰러 비밀번호를 설정해 주세요.
                </p>
            </div>
            <div className="flex items-center justify-center gap-2 text-button">
                <CheckIcon className="h-7 w-7 p-0.5"></CheckIcon>
                <p className="text-button text-gray-700">
                    <span className="font-bold text-primary-700">{email}</span>
                    으로 보냈어요.
                </p>
            </div>
        </div>
    )
}