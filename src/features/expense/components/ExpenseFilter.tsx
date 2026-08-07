import { ChevronDown, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  FilterTabGroup,
  type FilterTab,
} from '@/shared/components/ui/FilterTabGroup';
import { Button } from '@/shared/components/ui/Button';
import type {
  ExpenseFilter as ExpenseFilterValue,
} from '@/features/expense';

const FILTER_TABS: FilterTab<ExpenseFilterValue>[] = [
  {
    value: 'TOTAL',
    label: '전체 상태',
  },
  {
    value: 'THIS_MONTH',
    label: '이번 달',
  },
];

interface ExpenseFilterProps {
  activeFilter: ExpenseFilterValue;
  onFilterChange: (filter: ExpenseFilterValue) => void;
}

export const ExpenseFilter = ({
  activeFilter,
  onFilterChange,
}: ExpenseFilterProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex w-full items-center justify-between">
      <div className="hidden w-full items-center justify-between lg:flex">
        <FilterTabGroup
          tabs={FILTER_TABS}
          value={activeFilter}
          onChange={onFilterChange}
        />

        <Button
          leftIcon={<Plus size={18} />}
          onClick={() => navigate('/expenses/new')}
        >
          생활비 등록
        </Button>
      </div>

      <div className="flex w-full items-center gap-2 lg:hidden">
        <div className="relative">
          <select
            value={activeFilter}
            onChange={e =>
              onFilterChange(
                e.target.value as ExpenseFilterValue,
              )
            }
            className="appearance-none rounded-full border border-gray-200 bg-white py-1.5 pl-3 pr-8 text-[13px] font-medium text-gray-700 focus:outline-none"
          >
            {FILTER_TABS.map(tab => (
              <option
                key={tab.value}
                value={tab.value}
              >
                {tab.label}
              </option>
            ))}
          </select>

          <ChevronDown
            size={16}
            className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-400"
          />
        </div>
      </div>
    </div>
  );
};