import type { TextareaHTMLAttributes } from 'react';
import { cn } from '@/shared/lib/cn';

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  showCount?: boolean;
  maxLength?: number;
  countInside?: boolean;
  containerClassName?: string;
  labelClassName?: string;
}

export const TextArea = ({
  label,
  error,
  hint,
  required,
  showCount,
  maxLength,
  countInside = false,
  containerClassName,
  labelClassName,
  value,
  className,
  id,
  rows = 4,
  ...props
}: TextAreaProps) => {
  const inputId = id ?? label?.replace(/\s/g, '-').toLowerCase();
  const currentLength = typeof value === 'string' ? value.length : 0;

  return (
    <div className={cn('flex flex-col gap-1.5', containerClassName)}>
      {label && (
        <label
          htmlFor={inputId}
          className={cn('text-caption font-bold text-gray-900', labelClassName)}
        >
          {label}
          {required && <span className="ml-0.5 text-red-500">*</span>}
        </label>
      )}
      <div className="relative">
        <textarea
          id={inputId}
          rows={rows}
          maxLength={maxLength}
          value={value}
          className={cn(
            'w-full resize-none rounded-lg border bg-white px-3 py-2.5',
            'text-button text-gray-900 placeholder:text-gray-400',
            'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
            'transition-colors',
            error ? 'border-red-500' : 'border-gray-100',
            className,
          )}
          {...props}
        />
        {countInside && showCount && maxLength && (
          <p className="pointer-events-none absolute bottom-3.5 right-4 text-caption leading-normal text-gray-400">
            {currentLength}/{maxLength}
          </p>
        )}
      </div>
      {(error || hint || (!countInside && showCount && maxLength)) && (
        <div className="flex items-center justify-between">
          <div>
            {error && <p className="text-xs text-red-500">{error}</p>}
            {hint && !error && <p className="text-xs text-gray-400">{hint}</p>}
          </div>
          {!countInside && showCount && maxLength && (
            <p className="text-xs text-gray-400">
              {currentLength}/{maxLength}
            </p>
          )}
        </div>
      )}
    </div>
  );
};
