import { cn } from '@/shared/lib/cn';

export interface CheckboxOption<T extends string> {
  value: T;
  label: string;
}

interface CheckboxGroupProps<T extends string> {
  label?: string;
  options: CheckboxOption<T>[];
  value: T[];
  onChange: (value: T[]) => void;
  direction?: 'row' | 'col';
  className?: string;
}

export const CheckboxGroup = <T extends string>({
  label,
  options,
  value,
  onChange,
  direction = 'row',
  className,
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
              type="checkbox"
              checked={value.includes(opt.value)}
              onChange={() => toggle(opt.value)}
              className={cn(
                // Figma: 체크 시 Blue500(#358CFF) 배경, 테두리 Gray400(#C4C4C4)
                'h-6 w-6 rounded-[4px] border-gray-400 accent-primary-500',
                'focus:ring-primary-500',
              )}
            />
            <span className="text-sm text-gray-700">{opt.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
};
