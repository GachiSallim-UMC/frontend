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
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex h-[50px] w-[160px] justify-between items-center whitespace-nowrap rounded-lg border pl-[34px] pr-[16px] text-button font-normal transition-colors',
          isActive || isOpen
            ? 'border-primary-500 bg-primary-100 text-primary-500'
            : 'border-gray-100 bg-white text-gray-500 hover:bg-gray-100',
        )}
      >
        {displayText}
        <ChevronDown
          className={cn(
            'h-6 w-6 shrink-0 transition-transform',
            isOpen && 'rotate-180',
            isActive || isOpen ? 'text-primary-500' : 'text-gray-400',
          )}
        />
      </button>

      {/* 드롭다운 메뉴 창 */}
      {isOpen && (
        <div className="absolute left-0 z-10 mt-2 w-48 origin-top-left overflow-hidden rounded-lg border border-gray-100 bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          {options.map(option => {
            const isSelected = value === option.value;
            return (
              <button
                key={option.value}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                }}
                className={cn(
                  'flex w-full items-center justify-between px-4 py-3 text-button font-normal transition-colors',
                  isSelected
                    ? 'bg-primary-100 text-primary-500'
                    : 'text-gray-500 hover:bg-gray-100',
                )}
              >
                {option.label}
                {isSelected && <Check className="h-5 w-5 text-primary-500" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
