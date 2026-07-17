import { Button } from "@/shared/components"

interface TermsButtonGroupProps {
    onAgree: () => void;
    onCancel: () => void;
}

export const TermsButtonGroup = ({ onAgree, onCancel }: TermsButtonGroupProps) => {
    return (
        <div className="flex flex-shrink-0 gap-5 border-t border-gray-100 py-7 px-10">
            <Button
                variant="primary"
                size="md"
                className="flex-[2] font-bold"
                onClick={onAgree}
            >
                동의하고 계속하기
            </Button>

            <Button
                variant="ghost"
                size="md"
                className="flex-1 font-bold"
                onClick={onCancel}
            >
                취소
            </Button>
        </div>
    );
};