import type { ButtonHTMLAttributes } from 'react';
import { cn } from '@/shared/lib/cn';

import SwitchOnIcon from "@/assets/icons/mypage/switch-on.svg?react"
import SwitchOffIcon from "@/assets/icons/mypage/switch-off.svg?react"

export interface SwitchProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export const Switch = ({
  checked,
  onChange,
  disabled = false,
  className,
  ...props
}: SwitchProps) => {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        'inline-flex shrink-0 cursor-pointer items-center justify-center rounded-full transition-opacity',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
        disabled && 'cursor-not-allowed opacity-50',
        className
      )}
      {...props}
    >
      {checked ? <SwitchOnIcon /> : <SwitchOffIcon />}
    </button>
  );
};