import { useState } from 'react';
import { cn } from '@/shared/lib/cn';
import DropdownIcon from '@/assets/icons/notification/chevron-down.svg';

interface FilterDropdownProps {
  value: string;
  options: string[];
  onChange: (val: string) => void;
}

export const FilterDropdown = ({ value, options, onChange }: FilterDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center justify-end gap-[101px] bg-white border border-gray-100 rounded-lg pt-[13px] pr-[14px] pb-[13px] pl-[24px]"
      >
        <span className="text-[16px] font-normal text-gray-600 leading-normal">{value}</span>
        <img 
          src={DropdownIcon} 
          alt="드롭다운" 
          className={cn("w-6 h-6 transition-transform", isOpen && "rotate-180")} 
        />
      </button>
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-full bg-white border border-gray-100 rounded-lg shadow-dropdown z-10 py-2">
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => {
                onChange(opt);
                setIsOpen(false);
              }}
              className="w-full text-left px-6 py-2 text-[16px] font-normal text-gray-600 leading-normal hover:bg-gray-50 transition-colors"
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
