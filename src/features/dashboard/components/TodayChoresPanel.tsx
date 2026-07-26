import { Circle } from 'lucide-react';
import { Panel, StatusBadge } from '@/shared/components';
import type { DashboardChoreDto } from '@/features/dashboard/types/dashboard.types'

interface TodayChoresPanelProps {
  chores: DashboardChoreDto[];
}

export const TodayChoresPanel = ({ chores }: TodayChoresPanelProps) => {
    if (chores.length === 0) {
        return (
            <Panel>
                <p className="text-sm text-gray-500 pb-5">오늘 예정된 집안일이 없습니다.</p>
            </Panel>
        );
    }

    return (
        <Panel>
            <ul className="flex flex-col gap-5">
                {chores.map((chore) => (
                    <li
                        key={chore.choreId}
                        className="flex items-center justify-between border-b border-gray-100 pb-5 last:border-0 last:pb-0 first:pt-0"
                    >
                        <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                                <Circle className="shrink-0 h-3 w-3 fill-green-700" strokeWidth={0}/>
                                <p className="font-bold text-gray-900">{chore.title}</p>
                            </div>
                            <div>
                                <p className="mt-1 text-sm text-gray-600">
                                    담당: {chore.assigneeName} | {chore.repeatText}
                                </p>
                            </div>
                        </div>
                        {/* API 명세 기준 상태값(DONE 등)으로 분기 처리 */}
                        <StatusBadge variant={chore.status === 'DONE' ? 'done' : 'pending'} />
                    </li>
                ))}
            </ul>
        </Panel>
    )
}