import { useState } from 'react';
import {
  ChoreTable,
  ChoreCalendarView,
  ChoreFilterBar,
  type ChoreFilter,
} from '@/features/chore/index';
import { chores as mockChores } from '@/pages/_shared/mockData';

export const ChorePage = () => {
  const [filter, setFilter] = useState<ChoreFilter>({});

  return (
    <div className="mt-[92px] flex w-full flex-1 flex-col gap-[20px] rounded-2xl bg-white p-[30px]">
      <ChoreFilterBar filter={filter} onFilterChange={setFilter} />
      <div className="w-full">
        <ChoreCalendarView />
      </div>
      <div className="w-full flex-1">
        <ChoreTable
          chores={mockChores}
          onEdit={chore => console.log('Edit chore', chore.name)}
          onShare={chore => console.log('Share chore', chore.name)}
        />
      </div>
    </div>
  );
};
