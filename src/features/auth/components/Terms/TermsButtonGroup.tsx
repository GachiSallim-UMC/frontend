import { Button } from "@/shared/components"

interface TermsButtonGroupProps {
    onAgree: () => void;
    onCancel: () => void;
}

export const TermsButtonGroup = ({ onAgree, onCancel }: TermsButtonGroupProps) => {
    return (
        <>
            {/* 모바일: 동의 버튼만 노출 (취소는 헤더 뒤로가기로 대체) */}
            <div className="flex flex-shrink-0 border-t border-gray-100 px-4 pt-4 pb-[calc(16px+env(safe-area-inset-bottom))] lg:hidden">
                <Button
                    variant="primary"
                    size="md"
                    className="h-11 w-full text-mobile-body font-bold"
                    onClick={onAgree}
                >
                    동의하고 계속하기
                </Button>
            </div>

            {/* 데스크톱 */}
            <div className="hidden flex-shrink-0 gap-5 border-t border-gray-100 py-7 px-10 lg:flex">
                <Button
                    variant="primary"
                    size="md"
                    className="flex-[2] font-bold"
                    onClick={onAgree}
                >
                    동의하고 계속하기
                </Button>

                <Button
                    variant="outline"
                    size="md"
                    className="flex-1 font-bold"
                    onClick={onCancel}
                >
                    취소
                </Button>
            </div>
        </>
    );
};