import {
  FilterTabGroup,
  type FilterTab,
} from '@/shared/components/ui/FilterTabGroup';
import { FilterDropdown } from '@/shared/components/ui/Button';
import type { ExpenseFilter as ExpenseFilterValue } from '@/features/expense/types';

/** 지불 상태 필터 (모바일 전용, StatusBadge 기준: paid = 완료, unpaid = 미정산) */
export type ExpenseStatusFilter = 'ALL' | 'paid' | 'unpaid';

const DATE_TABS: FilterTab<ExpenseFilterValue>[] = [
  { value: 'TOTAL', label: '전체 기간' },
  { value: 'THIS_MONTH', label: '이번 달' },
];

const STATUS_TABS: FilterTab<ExpenseStatusFilter>[] = [
  { value: 'ALL', label: '전체 상태' },
  { value: 'paid', label: '완료' },
  { value: 'unpaid', label: '미정산' },
];

interface ExpenseFilterProps {
  activeFilter: ExpenseFilterValue;
  onFilterChange: (filter: ExpenseFilterValue) => void;
  activeStatus: ExpenseStatusFilter;
  onStatusChange: (status: ExpenseStatusFilter) => void;
}

export const ExpenseFilter = ({
  activeFilter,
  onFilterChange,
  activeStatus,
  onStatusChange,
}: ExpenseFilterProps) => {
  return (
    <div className="flex items-center">
      {/* 데스크톱: 기간 필터만 (상태 필터 없음) */}
      <div className="hidden lg:flex lg:items-center">
        <FilterTabGroup
          tabs={DATE_TABS}
          value={activeFilter}
          onChange={onFilterChange}
        />
      </div>

      {/* 모바일: 상태 드롭다운 + 기간 드롭다운, 둘 다 표시 */}
      <div className="flex items-center gap-2 lg:hidden">
        <FilterDropdown
          defaultLabel="전체 상태"
          value={activeStatus}
          options={STATUS_TABS}
          onChange={value => onStatusChange(value as ExpenseStatusFilter)}
        />
        <FilterDropdown
          defaultLabel="전체 기간"
          value={activeFilter}
          options={DATE_TABS}
          onChange={value => onFilterChange(value as ExpenseFilterValue)}
          allValue="TOTAL"
        />
      </div>
    </div>
  );
};
