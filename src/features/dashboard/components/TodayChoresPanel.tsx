import { Circle } from 'lucide-react';
import { Panel, StatusBadge } from '@/shared/components';
import type { DashboardChoreDto } from '@/features/dashboard/types/dashboard.types'

interface TodayChoresPanelProps {
  chores: DashboardChoreDto[];
}

const REPEAT_TEXT_LABEL: Record<string, string> = {
    'Daily repeat': '매일',
    'Weekly repeat': '매주',
    'Monthly repeat': '매월',
    'No repeat': '반복 없음',
};

const getRepeatTextLabel = (repeatText: string) => REPEAT_TEXT_LABEL[repeatText] ?? repeatText;

export const TodayChoresPanel = ({ chores }: TodayChoresPanelProps) => {
    if (chores.length === 0) {
        return (
            <Panel>
                <p className="text-sm text-gray-500 pb-5">오늘 예정된 집안일이 없습니다.</p>
            </Panel>
        );
    }

    return (
        <Panel className="p-0 lg:p-5">
            <ul className="flex flex-col lg:gap-5">
                {chores.map((chore) => (
                    <li
                        key={chore.choreId}
                        className="flex items-center justify-between border-b border-gray-100 px-4 py-[13px] last:border-0 lg:border-b lg:px-0 lg:py-0 lg:pb-5 lg:last:border-0 lg:last:pb-0 lg:first:pt-0"
                    >
                        <div className="flex min-w-0 flex-col">
                            <div className="flex items-center gap-2">
                                <Circle
                                    className={`shrink-0 h-2 w-2 lg:h-3 lg:w-3 ${chore.status === 'DONE' ? 'fill-green-700' : 'fill-primary-700'}`}
                                    strokeWidth={0}
                                />
                                <p className="truncate text-mobile-label font-bold text-gray-900 lg:text-base">{chore.title}</p>
                            </div>
                            <div>
                                <p className="mt-0.5 text-mobile-caption text-gray-600 lg:mt-1 lg:text-sm">
                                    담당: {chore.assigneeName} | {getRepeatTextLabel(chore.repeatText)}
                                </p>
                            </div>
                        </div>
                        {/* API 명세 기준 상태값(DONE 등)으로 분기 처리 */}
                        <StatusBadge
                            variant={chore.status === 'DONE' ? 'done' : 'pending'}
                            className="h-[26px] w-[52px] shrink-0 text-mobile-caption lg:h-[34px] lg:w-[68px] lg:text-caption"
                        />
                    </li>
                ))}
            </ul>
        </Panel>
    )
}
