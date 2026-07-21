import type { InputHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/shared/lib/cn';

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  leftAddon?: ReactNode;
  rightAddon?: ReactNode;
  containerClassName?: string;
  labelClassName?: string;
}

export const FormInput = ({
  label,
  error,
  hint,
  required,
  leftAddon,
  rightAddon,
  containerClassName,
  labelClassName,
  className,
  id,
  ...props
}: FormInputProps) => {
  const inputId = id ?? label?.replace(/\s/g, '-').toLowerCase();

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
      <div className="relative flex items-center">
        {leftAddon && (
          <span className="pointer-events-none absolute left-3 text-gray-400">{leftAddon}</span>
        )}
        <input
          id={inputId}
          className={cn(
            'h-[50px] w-full rounded-lg border bg-white text-button text-gray-900',
            'placeholder:text-gray-400 transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
            error ? 'border-red-500' : 'border-gray-100',
            leftAddon && 'pl-9',
            rightAddon && 'pr-9',
            !leftAddon && 'pl-3',
            !rightAddon && 'pr-3',
            className,
          )}
          {...props}
        />
        {rightAddon && <span className="absolute right-3 text-gray-400">{rightAddon}</span>}
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
      {hint && !error && <p className="text-xs text-gray-400">{hint}</p>}
    </div>
  );
};
