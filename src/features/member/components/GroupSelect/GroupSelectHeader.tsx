import { useNavigate } from "react-router-dom"
import LogoIcon from "@/assets/logo.svg?react"
import { Button } from "@/shared/components";

export const GroupSelectHeader = () => {
    const navigate = useNavigate();

    // 로그아웃 처리
    const handleLogout = () => {
        navigate("/login");
    };

    return (
        <div className="flex flex-shrink-0 items-center justify-between border-b border-gray-100 bg-white px-7 py-6">
            <div className="flex items-center gap-2">
                <LogoIcon className="h-8 w-7" />
                <h1 className="text-body font-medium text-gray-900 font-logo tracking-wider">같이살림</h1>
            </div>

            <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-600">홍길동 님</span>
                <div className="h-4 border-l border-gray-300" />
                <Button 
                    variant="secondary"
                    size="sm"
                    onClick={handleLogout}
                >
                    로그아웃
                </Button>
            </div>
        </div>
    );
};