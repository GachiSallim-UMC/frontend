import { cn } from '@/shared/lib/cn';

export interface ChatFilterChipOption<T extends string> {
  value: T;
  label: string;
}

interface ChatFilterChipsProps<T extends string> {
  options: ChatFilterChipOption<T>[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
}

export const ChatFilterChips = <T extends string>({ options, value, onChange, className }: ChatFilterChipsProps<T>) => {
  return (
    <div className={cn('flex flex-wrap items-center gap-1', className)}>
      {options.map(option => (
        <button
          key={option.value}
          type="button"
          onClick={() => onChange(option.value)}
          className={cn(
            'rounded-[20px] border px-4 py-[9px] text-[12px] font-bold uppercase leading-[normal] transition-colors',
            value === option.value
              ? 'border-primary-400 bg-primary-100 text-primary-400'
              : 'border-gray-100 bg-white text-gray-600 hover:bg-gray-100',
          )}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};
