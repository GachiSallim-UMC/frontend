import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { FilterDropdown } from '@/shared/components/ui/Button';
import { SearchInput } from '@/shared/components/ui/SearchInput';
import { Button } from '@/shared/components/ui/Button';
import type { ChoreFilter } from '../types/chore.types';
import type { Member } from '@/features/member';
import {
  CHORE_STATUS_FILTER_OPTIONS,
  CHORE_REPEAT_FILTER_OPTIONS,
} from '../constants/chore.constants';

interface ChoreFilterBarProps {
  filter: ChoreFilter;
  onFilterChange: (filter: ChoreFilter) => void;
  groupMembers?: Member[];
}

export const ChoreFilterBar = ({
  filter,
  onFilterChange,
  groupMembers = [],
}: ChoreFilterBarProps) => {
  const navigate = useNavigate();

  const assigneeOptions = useMemo(() => {
    const defaultOption = { label: '전체', value: 'ALL' };
    const memberOptions = groupMembers.map(member => ({
      label: member.name,
      value: member.id,
    }));
    return [defaultOption, ...memberOptions];
  }, [groupMembers]);

  const handleDropdownChange = (key: keyof ChoreFilter, value: string) => {
    if (value === 'ALL') {
      onFilterChange({ ...filter, [key]: undefined });
    } else {
      const parsedValue = key === 'assigneeId' ? Number(value) : value;
      onFilterChange({ ...filter, [key]: parsedValue });
    }
  };
  return (
    <div className="flex w-full items-center justify-between">
      <div className="flex items-center gap-[12px]">
        <FilterDropdown
          defaultLabel="전체 상태"
          value={filter.status || 'ALL'}
          options={CHORE_STATUS_FILTER_OPTIONS}
          onChange={val => handleDropdownChange('status', val)}
        />

        {/* 2. 담당자 필터 */}
        <FilterDropdown
          defaultLabel="전체 담당자"
          value={filter.assigneeId ? String(filter.assigneeId) : 'ALL'}
          options={assigneeOptions}
          onChange={val => handleDropdownChange('assigneeId', val)}
        />

        {/* 3. 주기 필터 */}
        <FilterDropdown
          defaultLabel="전체 주기"
          value={filter.repeatType || 'ALL'}
          options={CHORE_REPEAT_FILTER_OPTIONS}
          onChange={val => handleDropdownChange('repeatType', val)}
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
