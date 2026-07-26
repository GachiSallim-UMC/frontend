import { cn } from '@/shared/lib/cn';

export interface FilterTab<T extends string> {
  value: T;
  label: string;
}

interface FilterTabGroupProps<T extends string> {
  tabs: FilterTab<T>[];
  value: T | T[];
  onChange: (value: T) => void;
  className?: string;
}

export const FilterTabGroup = <T extends string>({
  tabs,
  value,
  onChange,
  className,
}: FilterTabGroupProps<T>) => {
  return (
    <div className={cn('flex items-center gap-1', className)}>
      {tabs.map(tab => {
        const isActive = Array.isArray(value) ? value.includes(tab.value) : value === tab.value;
        return (
          <button
            key={tab.value}
            type="button"
            onClick={() => onChange(tab.value)}
            className={cn(
              'flex h-[50px] items-center rounded-lg border px-[34px] text-button font-normal transition-colors',
              // Figma 디자인 시스템 필터 탭: Active=연파랑+파란테두리+파란글씨
              isActive
                ? 'border-primary-500 bg-primary-100 text-primary-500'
                : 'border-gray-100 bg-white text-gray-500 hover:bg-gray-100',
            )}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};
