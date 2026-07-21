import { Circle } from 'lucide-react';
import { Panel, StatusBadge } from '@/shared/components';

interface Chore {
  id: string;
  name: string;
  assignee: { name: string };
  repeatType: 'daily' | 'other' | 'once' | string;
  status: 'done' | 'pending' | string;
}

export const TodayChoresPanel = ({ chores }: { chores: Chore[] }) => {
    return (
        <Panel>
            <ul className="flex flex-col gap-5">
                {chores.map((chore) => (
                    <li
                        key={chore.id}
                        className="flex items-center justify-between border-b border-gray-100 pb-5 last:border-0 last:pb-0 first:pt-0"
                    >
                        <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                                <Circle className="shrink-0 h-3 w-3 fill-green-700" strokeWidth={0}/>
                                <p className="font-bold text-gray-900">{chore.name}</p>
                            </div>
                            <div>
                                <p className="mt-1 text-sm text-gray-600">
                                    담당: {chore.assignee.name} | {chore.repeatType === 'daily' ? '오늘' : '지정일'}
                                </p>
                            </div>
                        </div>
                        <StatusBadge variant={chore.status === 'done' ? 'done' : 'pending'} />
                    </li>
                ))}
            </ul>
        </Panel>
    )
}