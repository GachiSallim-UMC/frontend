import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ChoreCalendarView,
  ChoreFilterBar,
  ChoreTable,
  useChores,
  useCompleteChore,
} from '@/features/chore';
import type { Chore, ChoreFilter, RepeatType } from '@/features/chore';
import { useGroupStore } from '@/shared/store';

const REPEAT_TYPE_FROM_FILTER: Record<NonNullable<ChoreFilter['repeatType']>, RepeatType> = {
  NONE: 'once',
  DAILY: 'daily',
  WEEKLY: 'weekly',
  MONTHLY: 'monthly',
  CUSTOM: 'custom',
};

export const ChoreListPage = () => {
  const [filter, setFilter] = useState<ChoreFilter>({});
  const navigate = useNavigate();
  const completeMutation = useCompleteChore();

  const selectedGroupId = useGroupStore(state => state.selectedGroupId);
  const groupId = selectedGroupId ? Number(selectedGroupId) : undefined;
  const { data: chores = [] } = useChores(
    groupId && Number.isSafeInteger(groupId)
      ? {
          groupId,
          status: filter.status,
          assigneeId: filter.assigneeId,
        }
      : undefined,
  );

  const filteredChores = useMemo(() => {
    const keyword = filter.keyword?.trim().toLocaleLowerCase();
    const repeatType = filter.repeatType ? REPEAT_TYPE_FROM_FILTER[filter.repeatType] : undefined;

    return chores.filter(
      chore =>
        (!keyword || chore.name.toLocaleLowerCase().includes(keyword)) &&
        (!repeatType || chore.repeatType === repeatType),
    );
  }, [chores, filter.keyword, filter.repeatType]);

  const handleEdit = (chore: Chore) => navigate(`/chores/${chore.id}/edit`);

  const handleToggleComplete = (chore: Chore) => {
    completeMutation.mutate(String(chore.id), {
      onError: error => {
        console.error('상태 변경 실패:', error);
        alert('상태 변경에 실패했습니다.');
      },
    });
  };

  return (
    <div className="mt-[28px] flex w-full flex-1 flex-col gap-[20px] rounded-2xl bg-white p-[30px]">
      <ChoreFilterBar filter={filter} onFilterChange={setFilter} />
      <div className="w-full">
        <ChoreCalendarView chores={filteredChores} />
      </div>
      <div className="w-full flex-1">
        <ChoreTable
          chores={filteredChores}
          onEdit={handleEdit}
          onShare={chore => console.log('Share chore', chore.name)}
          onToggleComplete={handleToggleComplete}
          isUpdating={completeMutation.isPending}
        />
      </div>
    </div>
  );
};
