import { useNavigate } from "react-router-dom"
import { ChevronLeft } from "lucide-react";

export const PrivacyHeader = () => {
    const navigate = useNavigate();

    return (
        <header className="flex flex-shrink-0 items-center justify-between border-b border-gray-100 bg-white px-7 py-7">
            <div className="flex items-center">
                <button 
                    type="button"
                    onClick={() =>navigate(-1)}
                    className="mr-2 py-1 px-2"
                >
                    <ChevronLeft className="h-4 w-2 text-gray-800" />
                </button>
                <h1 className="text-xl font-bold text-gray-900">개인정보 처리방침</h1>
            </div>
            <span className="text-sm font-medium text-gray-500">시행일 2026.01.01</span>
        </header>
    );
};