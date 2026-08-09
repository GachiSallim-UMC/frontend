import ChevronLeft from "@/assets/icons/login/chevron-left.svg?react"

interface PrivacyHeaderProps {
    onBack: () => void;
}

export const PrivacyHeader = ({onBack}: PrivacyHeaderProps) => {

    return (
        <header className="flex flex-shrink-0 items-center justify-between gap-2 border-b border-gray-100 bg-white px-4 py-4 lg:px-7 lg:py-7">
            <div className="flex min-w-0 items-center">
                <button
                    type="button"
                    onClick={onBack}
                    className="mr-1 shrink-0 p-2 lg:px-2 lg:py-1"
                >
                    <ChevronLeft className="h-5 w-5 text-gray-800 lg:h-6 lg:w-6" />
                </button>
                <h2 className="truncate text-mobile-body font-bold tracking-wider text-gray-900 lg:text-xl">개인정보 처리방침</h2>
            </div>
            <span className="shrink-0 text-mobile-caption font-medium text-gray-500 lg:text-sm">시행일 2026.01.01</span>
        </header>
    );
};
