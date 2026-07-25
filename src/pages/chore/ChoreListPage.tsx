import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  ChoreTable,
  ChoreCalendarView,
  ChoreFilterBar,
  type ChoreFilter,
  choreApi,
} from '@/features/chore/index';
import { useMyGroups } from '@/features/member';

export const ChoreListPage = () => {
  const [filter, setFilter] = useState<ChoreFilter>({});
  const navigate = useNavigate();

  const { data: myGroups } = useMyGroups();
  const currentGroupId = myGroups?.[0]?.id;

  const { data: choresData = [] } = useQuery({
    queryKey: ['chores', currentGroupId, filter],
    queryFn: () =>
      choreApi.getList({
        groupId: Number(currentGroupId),
        status: filter.status ? (filter.status.toUpperCase() as 'PENDING' | 'DONE') : undefined,
        assigneeId: filter.assigneeId ? Number(filter.assigneeId) : undefined,
      }),
    enabled: !!currentGroupId,
  });

  return (
    <div className="mt-[28px] flex w-full flex-1 flex-col gap-[20px] rounded-2xl bg-white p-[30px]">
      <ChoreFilterBar filter={filter} onFilterChange={setFilter} />
      <div className="w-full">
        <ChoreCalendarView chores={choresData} />
      </div>
      <div className="w-full flex-1">
        <ChoreTable
          chores={choresData}
          onEdit={chore => {
            navigate(`/chores/${chore.choreId}/edit`);
          }}
          onShare={chore => console.log('Share chore', chore.title)}
        />
      </div>
    </div>
  );
};
