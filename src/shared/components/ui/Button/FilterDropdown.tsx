import { ChevronDown, Check } from 'lucide-react';
import { cn, useDropdown } from '@/shared/lib';

export interface FilterOption {
  label: string;
  value: string;
}

const MENU_MAX_HEIGHT = 260;

interface FilterDropdownProps {
  defaultLabel: string;
  value: string;
  options: FilterOption[];
  onChange: (value: string) => void;
  /** "전체"에 해당하는 값. 이 값이면 비활성(강조 없음)으로 표시합니다. */
  allValue?: string;
  /** 기본 모바일 pill 스타일과 다른 규격이 필요한 화면(예: 활동내역)에서 트리거 버튼 스타일을 오버라이드. */
  triggerClassName?: string;
  /** 바깥 wrapper(기본 inline-block shrink-0) 오버라이드. flex-1로 폭을 균등 분배할 때 사용. */
  containerClassName?: string;
}

export const FilterDropdown = ({
  defaultLabel,
  value,
  options,
  onChange,
  allValue = 'ALL',
  triggerClassName,
  containerClassName,
}: FilterDropdownProps) => {
  const { isOpen, dropUp, containerRef, toggle, close } = useDropdown({
    menuMaxHeight: MENU_MAX_HEIGHT,
  });

  const isActive = value !== allValue && value !== undefined && value !== '';
  const selectedOption = options.find(opt => opt.value === value);
  const displayText = isActive && selectedOption ? selectedOption.label : defaultLabel;

  return (
    <div className={cn('relative inline-block shrink-0 text-left', containerClassName)} ref={containerRef}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        onClick={toggle}
        className={cn(
          // 모바일은 목록 필터 pill과 같은 형태, lg부터 Figma 필터 드롭다운 규격.
          // 좌우 패딩을 같게 둡니다. 한쪽만 34px이면 긴 라벨에서 내용이 폭을 넘겨
          // 오른쪽으로 쏠려 보입니다. (예: "전체 카테고리")
          'flex items-center justify-between gap-1 whitespace-nowrap border font-normal transition-colors',
          'h-8 rounded-full px-3 text-mobile-label font-bold',
          'lg:h-[50px] lg:w-[160px] lg:rounded-lg lg:px-4 lg:text-button lg:font-normal',
          isActive || isOpen
            ? 'border-primary-500 bg-primary-100 text-primary-500'
            : 'border-gray-100 bg-white text-gray-500 hover:bg-gray-100',
          triggerClassName,
        )}
      >
        {displayText}
        <ChevronDown
          className={cn(
            'size-4 shrink-0 transition-transform lg:size-6',
            isOpen && 'rotate-180',
            isActive || isOpen ? 'text-primary-500' : 'text-gray-400',
          )}
        />
      </button>

      {/* 드롭다운 메뉴 창 */}
      {isOpen && (
        <ul
          role="listbox"
          aria-label={defaultLabel}
          style={{ maxHeight: MENU_MAX_HEIGHT }}
          className={cn(
            'absolute left-0 z-10 min-w-full origin-top-left overflow-y-auto rounded-lg border border-gray-100 bg-white shadow-dropdown lg:w-48',
            dropUp ? 'bottom-full mb-2' : 'top-full mt-2',
          )}
        >
          {options.map(option => {
            const isSelected = value === option.value;
            return (
              <li
                key={option.value}
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  onChange(option.value);
                  close();
                }}
                className={cn(
                  'flex cursor-pointer items-center justify-between gap-2 whitespace-nowrap px-4 py-2.5 text-mobile-label font-normal transition-colors lg:py-3 lg:text-button',
                  isSelected
                    ? 'bg-primary-100 text-primary-500'
                    : 'text-gray-500 hover:bg-gray-100',
                )}
              >
                {option.label}
                {isSelected && <Check className="size-4 shrink-0 text-primary-500 lg:size-5" />}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};
