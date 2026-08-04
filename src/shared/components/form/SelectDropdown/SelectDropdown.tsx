import { useEffect, useRef, useState, type ButtonHTMLAttributes } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { cn } from '@/shared/lib/cn';

export interface SelectOption<T extends string = string> {
  value: T;
  label: string;
}

const MENU_MAX_HEIGHT = 220;

interface SelectDropdownProps<T extends string>
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'value' | 'onChange' | 'type'> {
  label?: string;
  options: readonly SelectOption<T>[];
  value: T | '';
  onChange: (value: T) => void;
  placeholder?: string;
  error?: string;
  required?: boolean;
  containerClassName?: string;
  labelClassName?: string;
}

/**
 * 폼 입력용 드롭다운. 목록 필터의 FilterDropdown과 같은 형태로 열립니다.
 * (네이티브 select는 OS마다 모양이 달라 디자인이 맞지 않아 직접 구현합니다.)
 */
export const SelectDropdown = <T extends string>({
  label,
  options,
  value,
  onChange,
  placeholder = '선택',
  error,
  required,
  containerClassName,
  labelClassName,
  className,
  id,
  disabled,
  ...props
}: SelectDropdownProps<T>) => {
  const inputId = id ?? label?.replace(/\s/g, '-').toLowerCase();
  const [isOpen, setIsOpen] = useState(false);
  const [dropUp, setDropUp] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  /** 아래 공간이 부족하면 위로 펼칩니다. */
  const openMenu = () => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      const spaceBelow = window.innerHeight - rect.bottom;
      setDropUp(spaceBelow < MENU_MAX_HEIGHT && rect.top > spaceBelow);
    }
    setIsOpen(true);
  };

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const selectedOption = options.find(option => option.value === value);

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
      <div className="relative" ref={containerRef}>
        <button
          id={inputId}
          type="button"
          disabled={disabled}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          onClick={() => (isOpen ? setIsOpen(false) : openMenu())}
          className={cn(
            'flex h-[50px] w-full items-center justify-between gap-2 rounded-lg border bg-white px-3',
            'text-button transition-colors',
            'focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500',
            'disabled:cursor-not-allowed disabled:bg-gray-100',
            error ? 'border-red-500' : 'border-gray-100',
            selectedOption ? 'text-gray-900' : 'text-gray-500',
            className,
          )}
          {...props}
        >
          <span className="truncate">{selectedOption?.label ?? placeholder}</span>
          <ChevronDown
            size={16}
            className={cn(
              'shrink-0 text-gray-400 transition-transform',
              isOpen && 'rotate-180 text-primary-500',
            )}
          />
        </button>

        {isOpen && (
          <ul
            role="listbox"
            style={{ maxHeight: MENU_MAX_HEIGHT }}
            className={cn(
              'absolute left-0 right-0 z-20 overflow-y-auto rounded-lg border border-gray-100 bg-white py-1 shadow-dropdown',
              dropUp ? 'bottom-full mb-1.5' : 'top-full mt-1.5',
            )}
          >
            {options.map(option => {
              const isSelected = option.value === value;
              return (
                <li key={option.value}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => {
                      onChange(option.value);
                      setIsOpen(false);
                    }}
                    className={cn(
                      // 글자 크기는 트리거와 같게 (모바일 12px / lg 16px)
                      'flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-mobile-label transition-colors lg:py-2.5 lg:text-button',
                      isSelected
                        ? 'bg-primary-100 text-primary-500'
                        : 'text-gray-600 hover:bg-gray-100',
                    )}
                  >
                    <span className="truncate">{option.label}</span>
                    {isSelected && <Check className="size-4 shrink-0 text-primary-500" />}
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};
