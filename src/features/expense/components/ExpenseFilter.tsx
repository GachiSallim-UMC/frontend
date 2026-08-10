import { ChevronDown, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {
  FilterTabGroup,
  type FilterTab,
} from '@/shared/components/ui/FilterTabGroup';
import { Button } from '@/shared/components/ui/Button';
import type {
  ExpenseFilter as ExpenseFilterValue,
  ExpenseStatusFilter,
} from '@/features/expense';

const FILTER_TABS: FilterTab<ExpenseFilterValue>[] = [
  {
    value: 'TOTAL',
    label: '전체 기간',
  },
  {
    value: 'THIS_MONTH',
    label: '이번 달',
  },
];

interface ExpenseFilterProps {
  activeFilter: ExpenseFilterValue;
  onFilterChange: (filter: ExpenseFilterValue) => void;
  statusFilter: ExpenseStatusFilter;
  onStatusFilterChange: (filter: ExpenseStatusFilter) => void;
}

export const ExpenseFilter = ({
  activeFilter,
  onFilterChange,
  statusFilter,
  onStatusFilterChange,
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
            aria-label="정산 상태"
            value={statusFilter}
            onChange={e => onStatusFilterChange(e.target.value as ExpenseStatusFilter)}
            className="h-8 appearance-none rounded-full border border-gray-200 bg-white py-1.5 pl-4 pr-9 text-mobile-label font-medium text-gray-700 focus:border-primary-400 focus:outline-none"
          >
            <option value="ALL">전체 상태</option>
            <option value="unpaid">미정산</option>
            <option value="paid">완료</option>
          </select>

          <ChevronDown
            size={16}
            className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-400"
          />
        </div>

        <div className="relative">
          <select
            aria-label="정산 기간"
            value={activeFilter}
            onChange={e => onFilterChange(e.target.value as ExpenseFilterValue)}
            className="h-8 appearance-none rounded-full border border-gray-200 bg-white py-1.5 pl-4 pr-9 text-mobile-label font-medium text-gray-700 focus:border-primary-400 focus:outline-none"
          >
            {FILTER_TABS.map(tab => (
              <option key={tab.value} value={tab.value}>
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
