import type { ReactNode } from 'react';
import { cn } from '@/shared/lib/cn';

export interface CheckboxOption<T extends string> {
  value: T;
  label: ReactNode | string;
}

interface CheckboxGroupProps<T extends string> {
  label?: string;
  name?: string;
  required?: boolean;
  options: CheckboxOption<T>[];
  value: T[];
  onChange: (value: T[]) => void;
  direction?: 'row' | 'col';
  className?: string;
  size?: 'sm' | 'lg';
}

export const CheckboxGroup = <T extends string>({
  label,
  name,
  required = false,
  options,
  value,
  onChange,
  direction = 'row',
  className,
  size = 'lg',
}: CheckboxGroupProps<T>) => {
  const toggle = (optValue: T) => {
    if (value.includes(optValue)) {
      onChange(value.filter(v => v !== optValue));
    } else {
      onChange([...value, optValue]);
    }
  };

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {label && <span className="text-sm font-medium text-gray-700">{label}</span>}
      <div className={cn('flex gap-3', direction === 'col' ? 'flex-col' : 'flex-row flex-wrap')}>
        {options.map(opt => (
          <label key={opt.value} className="flex cursor-pointer items-center gap-2">
            <input
              name={name}
              type="checkbox"
              required={required && value.length === 0}
              checked={value.includes(opt.value)}
              onChange={() => toggle(opt.value)}
              className={cn(
                // Figma: 체크 시 Blue500(#358CFF) 배경, 테두리 Gray400(#C4C4C4)
                'rounded-[4px] border-gray-400 accent-primary-500',
                'focus:ring-primary-500',
                size === 'lg' ? 'h-6 w-6' : 'h-[16px] w-[16px] lg:h-[20px] lg:w-[20px]', // 모바일 반응형 체크박스
              )}
            />
            <span
              className={cn(
                size === 'lg'
                  ? 'text-sm text-gray-700'
                  : 'text-[12px] text-gray-700 lg:text-[16px] lg:text-gray-900', // 모바일 반응형 체크박스
              )}
            >
              {opt.label}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
};
