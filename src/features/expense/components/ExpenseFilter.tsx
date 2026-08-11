import { ChevronDown } from 'lucide-react';
import {
  FilterTabGroup,
  type FilterTab,
} from '@/shared/components/ui/FilterTabGroup';
import type { ExpenseFilter as ExpenseFilterValue } from '@/features/expense/types';

/** 지불 상태 필터 (모바일 전용, StatusBadge 기준: paid = 완료, unpaid = 미정산) */
export type ExpenseStatusFilter = 'ALL' | 'paid' | 'unpaid';

const DATE_TABS: FilterTab<ExpenseFilterValue>[] = [
  { value: 'TOTAL', label: '전체 상태' },
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

// 상태 드롭다운, 기간 드롭다운 둘 다 같은 마크업이라 공용 컴포넌트로 분리
const DropdownSelect = <T extends string>({
  value,
  onChange,
  tabs,
}: {
  value: T;
  onChange: (value: T) => void;
  tabs: FilterTab<T>[];
}) => (
  <div className="relative">
    <select
      value={value}
      onChange={e => onChange(e.target.value as T)}
      className="appearance-none rounded-full border border-gray-200 bg-white py-1.5 pl-3 pr-8 text-[13px] font-medium text-gray-700 focus:outline-none"
    >
      {tabs.map(tab => (
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
);

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
        <DropdownSelect
          value={activeStatus}
          onChange={onStatusChange}
          tabs={STATUS_TABS}
        />
        <DropdownSelect
          value={activeFilter}
          onChange={onFilterChange}
          tabs={DATE_TABS}
        />
      </div>
    </div>
  );
};