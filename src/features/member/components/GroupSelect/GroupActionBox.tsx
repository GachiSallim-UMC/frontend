import { Button } from "@/shared/components"
import CircleIcon from "@/assets/icons/member/circle.svg?react"
import PlusIcon from "@/assets/icons/member/plus.svg?react"

export const GroupActionBox = () => {
    return (
        <div className="flex items-center justify-center rounded-lg border border-dashed border-primary-300 bg-primary-50 px-22 py-5">
            <div className="relative mr-5 items-center justify-center">
                <CircleIcon className="h-21 w-21" />
                <PlusIcon className="absolute top-1/2 left-1/2 h-9 w-9 -translate-x-1/2 -translate-y-1/2" />
            </div>

            <div className="flex flex-col">
                <h3 className="text-base font-bold text-gray-800">새 그룹이 필요하신가요?</h3>
                <p className="mt-1 mb-2 text-xs font-medium text-gray-600">
                    새 그룹을 만들거나 초대 코드를 입력해 참여할 수 있어요.
                </p>

                <div className="flex gap-3">
                    <Button
                        variant="primary" 
                        size="sm" 
                        className="flex-1 text-xs font-bold"
                    >
                        그룹 생성
                    </Button>

                    <Button
                        variant="outline" 
                        size="sm" 
                        className="flex-1 text-xs font-bold"
                    >
                        코드 입력
                    </Button>
                </div>
            </div>
        </div>
    )
}