import { FilterDropdown } from './FilterDropdown';

interface LabelFilterDropdownProps {
  /** 선택된 라벨. options[0](전체 항목)이면 비활성 상태로 표시됩니다. */
  value: string;
  /** 첫 항목이 "전체 ..."인 라벨 목록 */
  options: string[];
  onChange: (value: string) => void;
}

const ALL = 'ALL';

/**
 * 값과 라벨이 같은 문자열 목록을 공용 FilterDropdown으로 연결하는 어댑터.
 * 알림·활동내역처럼 필터 상태를 라벨 문자열로 들고 있는 화면에서 사용합니다.
 */
export const LabelFilterDropdown = ({ value, options, onChange }: LabelFilterDropdownProps) => {
  const [allLabel = '전체', ...rest] = options;

  return (
    <FilterDropdown
      defaultLabel={allLabel}
      value={value === allLabel ? ALL : value}
      options={rest.map(option => ({ label: option, value: option }))}
      onChange={next => onChange(next === ALL ? allLabel : next)}
    />
  );
};
