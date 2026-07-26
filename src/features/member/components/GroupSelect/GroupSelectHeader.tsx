import LogoIcon from "@/assets/logo.svg?react"
import { Button } from "@/shared/components";

interface GroupSelectHeaderProps {
    userName: string;
    onLogout: () => void;
    isLoggingOut?: boolean;
}

export const GroupSelectHeader = ({ userName, onLogout, isLoggingOut = false }: GroupSelectHeaderProps) => {
    return (
        <div className="flex flex-shrink-0 items-center justify-between border-b border-gray-100 bg-white px-7 py-6">
            <div className="flex items-center gap-2">
                <LogoIcon className="h-8 w-7" />
                <h1 className="text-body font-medium text-gray-900 font-logo tracking-wider">같이살림</h1>
            </div>

            <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-600">{userName} 님</span>
                <div className="h-4 border-l border-gray-300" />
                <Button 
                    variant="secondary"
                    size="sm"
                    onClick={onLogout}
                    isLoading={isLoggingOut}
                >
                    로그아웃
                </Button>
            </div>
        </div>
    );
};
