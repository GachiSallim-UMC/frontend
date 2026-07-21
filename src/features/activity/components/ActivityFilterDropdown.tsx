import { useEffect, useRef } from 'react';
import { cn } from '@/shared/lib/cn';
import ChevronDownIcon from '@/assets/icons/activity/chevron-down.svg';

interface ActivityFilterDropdownProps {
  value: string;
  options: string[];
  onChange: (value: string) => void;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export const ActivityFilterDropdown = ({
  value,
  options,
  onChange,
  isOpen,
  onOpenChange,
}: ActivityFilterDropdownProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        onOpenChange(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onOpenChange]);

  return (
    <div ref={containerRef} className="relative h-[50px] w-full sm:w-[191px]">
      <button
        type="button"
        onClick={() => onOpenChange(!isOpen)}
        className="inline-flex h-full w-full items-center justify-between rounded-lg border border-gray-100 bg-white py-[13px] pl-[24px] pr-[14px]"
      >
        <span className="whitespace-nowrap text-[16px] font-normal text-gray-600">{value}</span>
        <img
          src={ChevronDownIcon}
          alt=""
          className={cn('size-6 shrink-0 transition-transform', isOpen && 'rotate-180')}
        />
      </button>
      {isOpen && (
        <div className="absolute left-0 top-[58px] z-10 w-full rounded-lg border border-gray-100 bg-white py-2 shadow-dropdown">
          {options.map(option => (
            <button
              key={option}
              type="button"
              onClick={() => {
                onChange(option);
                onOpenChange(false);
              }}
              className="w-full px-6 py-2 text-left text-[16px] font-normal text-gray-600 transition-colors hover:bg-gray-100"
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
