import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { cn } from '@/shared/lib';

export interface FilterOption {
  label: string;
  value: string;
}

interface FilterDropdownProps {
  defaultLabel: string;
  value: string;
  options: FilterOption[];
  onChange: (value: string) => void;
}

export const FilterDropdown = ({ defaultLabel, value, options, onChange }: FilterDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isActive = value !== 'ALL' && value !== undefined && value !== '';
  const selectedOption = options.find(opt => opt.value === value);
  const displayText = isActive && selectedOption ? selectedOption.label : defaultLabel;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block shrink-0 text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          // 모바일은 목록 필터 pill과 같은 형태, lg부터 Figma 필터 드롭다운 규격
          'flex items-center justify-between gap-1 whitespace-nowrap border font-normal transition-colors',
          'h-8 rounded-full px-3 text-mobile-label font-bold',
          'lg:h-[50px] lg:w-[160px] lg:gap-0 lg:rounded-lg lg:pl-[34px] lg:pr-[16px] lg:text-button lg:font-normal',
          isActive || isOpen
            ? 'border-primary-500 bg-primary-100 text-primary-500'
            : 'border-gray-100 bg-white text-gray-500 hover:bg-gray-100',
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
        <div className="absolute left-0 z-10 mt-2 min-w-full origin-top-left overflow-hidden rounded-lg border border-gray-100 bg-white shadow-dropdown lg:w-48">
          {options.map(option => {
            const isSelected = value === option.value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={cn(
                  'flex w-full items-center justify-between gap-2 whitespace-nowrap px-4 py-2.5 text-mobile-label font-normal transition-colors lg:py-3 lg:text-button',
                  isSelected
                    ? 'bg-primary-100 text-primary-500'
                    : 'text-gray-500 hover:bg-gray-100',
                )}
              >
                {option.label}
                {isSelected && <Check className="size-4 shrink-0 text-primary-500 lg:size-5" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
