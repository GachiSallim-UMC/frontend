import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { FilterTabGroup, type FilterTab } from '@/shared/components/ui/FilterTabGroup';
import { Button } from '@/shared/components/ui/Button';
import type { ExpenseFilter as ExpenseFilterValue } from '@/features/expense';

const FILTER_TABS: FilterTab<ExpenseFilterValue>[] = [
  { value: 'TOTAL', label: '전체 상태' },
  { value: 'THIS_MONTH', label: '이번 달' },
];

interface ExpenseFilterProps {
  activeFilter: ExpenseFilterValue;
  onFilterChange: (filter: ExpenseFilterValue) => void;
}

export const ExpenseFilter = ({ activeFilter, onFilterChange }: ExpenseFilterProps) => {
  const navigate = useNavigate();

  return (
    <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-4 w-full'>
      <FilterTabGroup
        tabs={FILTER_TABS}
        value={activeFilter}
        onChange={onFilterChange}
      />

      <Button leftIcon={<Plus size={24} />} onClick={() => navigate('/expenses/new')}>
        생활비 등록
      </Button>
    </div>
  );
};