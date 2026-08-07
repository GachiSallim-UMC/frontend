import type { ReactNode } from 'react';
import { FilterDropdown } from './FilterDropdown';

interface LabelFilterDropdownProps {
  /** 선택된 라벨. options[0](전체 항목)이면 비활성 상태로 표시됩니다. */
  value: string;
  /** 첫 항목이 "전체 ..."인 라벨 목록 */
  options: string[];
  onChange: (value: string) => void;
  triggerClassName?: string;
  containerClassName?: string;
  mobileIcon?: ReactNode;
}

/**
 * 값과 라벨이 같은 문자열 목록을 공용 FilterDropdown으로 연결하는 어댑터.
 * 알림·활동내역처럼 필터 상태를 라벨 문자열로 들고 있는 화면에서 사용합니다.
 */
export const LabelFilterDropdown = ({
  value,
  options,
  onChange,
  triggerClassName,
  containerClassName,
  mobileIcon,
}: LabelFilterDropdownProps) => {
  const [allLabel = '전체'] = options;

  return (
    <FilterDropdown
      defaultLabel={allLabel}
      // 라벨을 그대로 값으로 쓰므로 "전체" 라벨 자체가 비활성 기준입니다.
      allValue={allLabel}
      value={value}
      options={options.map(option => ({ label: option, value: option }))}
      onChange={onChange}
      triggerClassName={triggerClassName}
      containerClassName={containerClassName}
      mobileIcon={mobileIcon}
    />
  );
};
