import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
  const [activeTabs, setActiveTabs] = useState<string[]>([]);
  const navigate = useNavigate();

  return (
    <div className="flex w-full items-center justify-between">
      <div className="flex items-center gap-[12px]">
        <FilterTabGroup
          tabs={FILTER_TABS}
          value={activeTabs}
          onChange={val => {
            if (activeTabs.includes(val)) {
              setActiveTabs(prev => prev.filter(tab => tab !== val));

              if (val === 'status') onFilterChange({ ...filter, status: undefined });
              if (val === 'assignee') onFilterChange({ ...filter, assigneeId: undefined });
              if (val === 'cycle') onFilterChange({ ...filter, repeatType: undefined });
            } else {
              setActiveTabs(prev => [...prev, val]);

              // 임시 로직: 임의의 값 1개로만 필터링 되도록 설정
              if (val === 'status') {
                onFilterChange({ ...filter, status: 'PENDING' }); // 버튼 켜지면 '미완료'로 세팅
              }
              if (val === 'assignee') {
                onFilterChange({ ...filter, assigneeId: 5 }); // 버튼 켜지면 특정 담당자(예: 5번)로 세팅
              }
              if (val === 'cycle') {
                onFilterChange({ ...filter, repeatType: 'DAILY' }); // 버튼 켜지면 '매일'로 세팅
              }
            }
          }}
          className="gap-[12px]"
        />
        <SearchInput
          placeholder="집안일 검색"
          className="w-[230px]"
          value={filter?.keyword || ''}
          onChange={e => onFilterChange({ ...(filter || {}), keyword: e.target.value })}
        />
      </div>
      <Button leftIcon={<Plus size={24} />} onClick={() => navigate('/chores/new')}>
        집안일 등록
      </Button>
    </div>
  );
};
