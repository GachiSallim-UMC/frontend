import { Button } from "@/shared/components";

export const EmailSentButtonGroup = () => {
    return (
        <div className="flex w-full flex-col items-center gap-3">
            <Button 
                variant="primary"
                size="md"
                className="w-full font-bold"
            >재설정 링크 보내기</Button>

            <Button
                variant="ghost"
                size="md"
                className="w-full font-bold"
            >메일 다시 보내기</Button>
        </div>
    )
}