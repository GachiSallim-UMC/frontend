import type { ChangeEvent, InputHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/shared/lib/cn';
import { isDateOnlyInputValue } from '@/shared/lib/inputValidation';

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  leftAddon?: ReactNode;
  rightAddon?: ReactNode;
  containerClassName?: string;
  labelClassName?: string;
  inputSize?: 'sm' | 'lg';
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
  type,
  onChange,
  inputSize = 'lg',
  ...props
}: FormInputProps) => {
  const inputId = id ?? label?.replace(/\s/g, '-').toLowerCase();
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (type === 'date' && !isDateOnlyInputValue(event.currentTarget.value)) return;
    onChange?.(event);
  };

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
          type={type}
          onChange={handleChange}
          className={cn(
            'w-full rounded-lg border bg-white text-gray-900',
            'placeholder:text-gray-400 transition-colors',
            'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
            inputSize === 'lg'
              ? 'h-[50px] text-button' // lg 기준
              : 'h-[44px] text-[12px] lg:h-[50px] lg:text-button', // 모바일 기준
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
