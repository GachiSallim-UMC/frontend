import type { InputHTMLAttributes } from 'react';
import { Calendar } from 'lucide-react';
import { cn } from '@/shared/lib/cn';

interface DatePickerProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
  required?: boolean;
}

export const DatePicker = ({
  label,
  error,
  required,
  className,
  id,
  ...props
}: DatePickerProps) => {
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
        <input
          id={inputId}
          type="date"
          className={cn(
            'h-[50px] w-full rounded-lg border bg-white px-3 pr-10',
            'text-button text-gray-900 transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
            '[&::-webkit-calendar-picker-indicator]:opacity-0',
            error ? 'border-red-500' : 'border-gray-100',
            className,
          )}
          {...props}
        />
        <Calendar
          size={16}
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
        />
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};
