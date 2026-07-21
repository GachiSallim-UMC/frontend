import ChevronLeft from "@/assets/icons/login/chevron-left.svg?react"

interface PrivacyHeaderProps {
    onBack: () => void;
}

export const PrivacyHeader = ({onBack}: PrivacyHeaderProps) => {

    return (
        <header className="flex flex-shrink-0 items-center justify-between border-b border-gray-100 bg-white px-7 py-7">
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
    );
};