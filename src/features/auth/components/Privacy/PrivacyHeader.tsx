import ChevronLeft from "@/assets/icons/login/chevron-left.svg?react"

interface PrivacyHeaderProps {
    onBack: () => void;
    onMobileBack?: () => void;
}

export const PrivacyHeader = ({onBack, onMobileBack}: PrivacyHeaderProps) => {

    return (
        <>
            {/* 모바일 헤더 */}
            <header className="relative flex h-[52px] flex-shrink-0 items-center justify-center border-b border-gray-100 bg-white px-4 lg:hidden">
                <button
                    type="button"
                    aria-label="뒤로 가기"
                    onClick={onMobileBack ?? onBack}
                    className="absolute left-4 flex size-6 items-center justify-center text-gray-900"
                >
                    <ChevronLeft className="size-6" strokeWidth={1.5} />
                </button>
                <h1 className="text-mobile-title font-bold tracking-[0.04em] text-gray-900">개인정보 처리방침</h1>
            </header>

            {/* 데스크톱 헤더 */}
            <header className="hidden flex-shrink-0 items-center justify-between border-b border-gray-100 bg-white px-7 py-7 lg:flex">
                <div className="flex items-center">
                    <button
                        type="button"
                        onClick={onBack}
                        className="mr-1 py-1 px-2"
                    >
                        <ChevronLeft className="h-6 w-6 text-gray-800" />
                    </button>
                    <h1 className="tracking-wider text-xl font-bold text-gray-900">개인정보 처리방침</h1>
                </div>
                <span className="text-sm font-medium text-gray-500">시행일 2026.01.01</span>
            </header>
        </>
    );
};