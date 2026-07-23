import {
    GroupList,
    GroupActionBox,
} from "@/features/member"
import { GroupPageHeader } from './GroupPageHeader';

export const GroupSelectPage = () => {
    return (
        <div className="flex min-h-screen items-center justify-center bg-primary-100">
            <div className="flex h-[696px] w-full max-w-2xl flex-col overflow-hidden rounded-3xl bg-white shadow-sm">
                <GroupPageHeader />

                <div className="flex-1 overflow-y-auto pt-5 pb-18 px-10">
                    {/*타이틀 영역*/}
                    <div className="mb-5">
                        <h1 className="mb-1 text-2xl font-bold text-gray-900">
                            어느 그룹으로 들어갈까요?
                        </h1>
                        <p className="text-sm font-medium text-gray-600">
                            참여 중인 그룹을 선택하거나 새 그룹을 만들어보세요.
                        </p>
                    </div>

                    <GroupList />

                    {/* 구분선 */}
                    <div className="relative py-6 flex items-center justify-center">
                        <div className="absolute inset-x-0 h-px bg-gray-200" />
                        <span className="relative bg-white px-3 text-xs font-bold text-gray-200">또는</span>
                    </div>

                    <GroupActionBox />
                </div>
            </div>
        </div>
    )
}
