import { useEffect, useRef } from 'react';
import { cn } from '@/shared/lib/cn';
import DropdownIcon from '@/assets/icons/notification/chevron-down.svg';

interface FilterDropdownProps {
  value: string;
  options: string[];
  onChange: (val: string) => void;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export const FilterDropdown = ({
  value,
  options,
  onChange,
  isOpen,
  onOpenChange,
}: FilterDropdownProps) => {
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
        onClick={() => onOpenChange(!isOpen)}
        className="inline-flex h-full w-full items-center justify-between rounded-lg border border-gray-100 bg-white py-[13px] pl-[24px] pr-[14px]"
      >
        <span className="whitespace-nowrap text-[16px] font-normal text-gray-600 leading-normal">{value}</span>
        <img
          src={DropdownIcon}
          alt="드롭다운"
          className={cn("size-6 shrink-0 transition-transform", isOpen && "rotate-180")}
        />
      </button>
      {isOpen && (
        <div className="absolute left-0 top-[58px] z-10 w-full rounded-lg border border-gray-100 bg-white py-2 shadow-dropdown">
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => {
                onChange(opt);
                onOpenChange(false);
              }}
              className="w-full px-6 py-2 text-left text-[16px] font-normal text-gray-600 leading-normal transition-colors hover:bg-gray-100"
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
