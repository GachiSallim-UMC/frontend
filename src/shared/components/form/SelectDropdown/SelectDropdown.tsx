import {
  useEffect,
  useId,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type KeyboardEvent,
} from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { cn, useDropdown } from '@/shared/lib';

export interface SelectOption<T extends string = string> {
  value: T;
  label: string;
}

const MENU_MAX_HEIGHT = 220;

interface SelectDropdownProps<T extends string> extends Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'value' | 'onChange' | 'type'
> {
  label?: string;
  options: readonly SelectOption<T>[];
  value: T | '';
  onChange: (value: T) => void;
  placeholder?: string;
  error?: string;
  required?: boolean;
  containerClassName?: string;
  labelClassName?: string;
  inputSize?: 'sm' | 'lg';
  optionClassName?: string;
}

/**
 * 폼 입력용 드롭다운. 목록 필터의 FilterDropdown과 같은 형태로 열립니다.
 * (네이티브 select는 OS마다 모양이 달라 디자인이 맞지 않아 직접 구현합니다.)
 *
 * 키보드: ↑/↓ 이동, Home/End, Enter·Space 선택, Escape 닫기.
 * 포커스는 트리거에 두고 aria-activedescendant로 활성 항목을 알립니다.
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
  optionClassName,
  className,
  id,
  disabled,
  onClick,
  onKeyDown,
  inputSize = 'lg',
  ...props
}: SelectDropdownProps<T>) => {
  const reactId = useId();
  const inputId = id ?? `select-${reactId}`;
  const listboxId = `${inputId}-listbox`;
  const optionId = (index: number) => `${inputId}-option-${index}`;

  const { isOpen, dropUp, containerRef, open, close, toggle } = useDropdown({
    menuMaxHeight: MENU_MAX_HEIGHT,
  });
  const selectedIndex = options.findIndex(option => option.value === value);
  const [activeIndex, setActiveIndex] = useState(selectedIndex);
  const listRef = useRef<HTMLUListElement>(null);

  // 열 때마다 현재 선택 항목에서 시작하고, 목록 밖이면 스크롤해 보여줍니다.
  useEffect(() => {
    if (!isOpen) return;
    setActiveIndex(selectedIndex >= 0 ? selectedIndex : 0);
  }, [isOpen, selectedIndex]);

  useEffect(() => {
    if (!isOpen || activeIndex < 0) return;
    listRef.current?.children[activeIndex]?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex, isOpen]);

  const selectAt = (index: number) => {
    const option = options[index];
    if (!option) return;
    onChange(option.value);
    close();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented || options.length === 0) return;

    if (!isOpen) {
      if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        event.preventDefault();
        open();
      }
      return;
    }

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setActiveIndex(previous => Math.min(previous + 1, options.length - 1));
        break;
      case 'ArrowUp':
        event.preventDefault();
        setActiveIndex(previous => Math.max(previous - 1, 0));
        break;
      case 'Home':
        event.preventDefault();
        setActiveIndex(0);
        break;
      case 'End':
        event.preventDefault();
        setActiveIndex(options.length - 1);
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        selectAt(activeIndex);
        break;
      default:
        break;
    }
  };

  const selectedOption = selectedIndex >= 0 ? options[selectedIndex] : undefined;

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
          {...props}
          id={inputId}
          type="button"
          disabled={disabled}
          role="combobox"
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-controls={isOpen ? listboxId : undefined}
          aria-activedescendant={isOpen && activeIndex >= 0 ? optionId(activeIndex) : undefined}
          onClick={event => {
            onClick?.(event);
            if (!event.defaultPrevented) toggle();
          }}
          onKeyDown={handleKeyDown}
          className={cn(
            'flex w-full items-center justify-between gap-2 rounded-lg border bg-white px-3',
            'transition-colors',
            'focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-500',
            'disabled:cursor-not-allowed disabled:bg-gray-100',
            inputSize === 'lg'
              ? 'h-[50px] text-button' // lg 기준
              : 'h-[44px] text-[12px] lg:h-[50px] lg:text-button', // 모바일 기준
            error ? 'border-red-500' : 'border-gray-100',
            selectedOption ? 'text-gray-900' : 'text-gray-500',
            className,
          )}
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
            ref={listRef}
            id={listboxId}
            role="listbox"
            aria-label={label}
            style={{ maxHeight: MENU_MAX_HEIGHT }}
            className={cn(
              'absolute left-0 right-0 z-20 overflow-y-auto rounded-lg border border-gray-100 bg-white py-1 shadow-dropdown',
              dropUp ? 'bottom-full mb-1.5' : 'top-full mt-1.5',
            )}
          >
            {options.map((option, index) => {
              const isSelected = index === selectedIndex;
              const isActive = index === activeIndex;
              return (
                <li
                  key={option.value}
                  id={optionId(index)}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => selectAt(index)}
                  onMouseEnter={() => setActiveIndex(index)}
                  className={cn(
                    // 글자 크기는 트리거와 같게 (모바일 12px / lg 16px)
                    'flex cursor-pointer items-center justify-between gap-2 px-3 py-2 text-mobile-label transition-colors lg:py-2.5 lg:text-button',
                    isSelected ? 'bg-primary-100 text-primary-500' : 'text-gray-600',
                    isActive && !isSelected && 'bg-gray-100',
                    optionClassName,
                  )}
                >
                  <span className="truncate">{option.label}</span>
                  {isSelected && <Check className="size-4 shrink-0 text-primary-500" />}
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
