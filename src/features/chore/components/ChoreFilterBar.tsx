import { useState } from 'react';
import { Plus } from 'lucide-react';
import { FilterTabGroup, type FilterTab } from '@/shared/components/ui/FilterTabGroup';
import { SearchInput } from '@/shared/components/ui/SearchInput';
import { Button } from '@/shared/components/ui/Button';
import type { ChoreFilter } from '../types/chore.types';

interface ChoreFilterBarProps {
  filter: ChoreFilter;
  onFilterChange: (filter: ChoreFilter) => void;
}

const FILTER_TABS: FilterTab<string>[] = [
  { value: 'status', label: '전체 상태' },
  { value: 'assignee', label: '전체 담당자' },
  { value: 'cycle', label: '전체 주기' },
];

export const ChoreFilterBar = ({ filter, onFilterChange }: ChoreFilterBarProps) => {
  const [activeTab, setActiveTab] = useState<string>('');

  return (
    <div className="flex w-full items-center justify-between">
      <div className="flex items-center gap-[12px]">
        <FilterTabGroup
          tabs={FILTER_TABS}
          value={activeTab}
          onChange={val => {
            if (activeTab === val) {
              //이미 눌린 버튼 취소
              setActiveTab('');

              if (val === 'status') {
                onFilterChange({ ...filter, status: undefined });
              }
            } else {
              setActiveTab(val);

              if (val === 'status') {
                onFilterChange({
                  ...filter,
                  status: filter.status ? undefined : 'pending',
                });
              }
            }
          }}
          className="gap-[12px]"
        />
        <SearchInput
          placeholder="집안일 검색"
          value={filter?.keyword || ''}
          onChange={e => onFilterChange({ ...(filter || {}), keyword: e.target.value })}
        />
      </div>
      <Button leftIcon={<Plus size={24} />}>집안일 등록</Button>
    </div>
  );
};
