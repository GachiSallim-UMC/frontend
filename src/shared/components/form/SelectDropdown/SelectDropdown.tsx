import type { SelectHTMLAttributes } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/shared/lib/cn';

export interface SelectOption<T extends string = string> {
  value: T;
  label: string;
}

interface SelectDropdownProps<T extends string> extends Omit<
  SelectHTMLAttributes<HTMLSelectElement>,
  'value' | 'onChange'
> {
  label?: string;
  options: SelectOption<T>[];
  value: T | '';
  onChange: (value: T) => void;
  placeholder?: string;
  error?: string;
  required?: boolean;
}

export const SelectDropdown = <T extends string>({
  label,
  options,
  value,
  onChange,
  placeholder = '선택',
  error,
  required,
  className,
  id,
  ...props
}: SelectDropdownProps<T>) => {
  const inputId = id ?? label?.replace(/\s/g, '-').toLowerCase();

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-caption font-bold text-gray-900">
          {label}
          {required && <span className="ml-0.5 text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        <select
          id={inputId}
          value={value}
          onChange={e => onChange(e.target.value as T)}
          className={cn(
            'h-[50px] w-full appearance-none rounded-lg border bg-white px-3 pr-9',
            'text-button text-gray-900 transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
            error ? 'border-red-500' : 'border-gray-100',
            !value && 'text-gray-400',
            className,
          )}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map(opt => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown
          size={16}
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};
