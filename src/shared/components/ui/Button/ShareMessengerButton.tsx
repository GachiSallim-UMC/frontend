import type { ButtonHTMLAttributes } from 'react';
import { cn } from '@/shared/lib/cn';
import MessengerIcon from '@/assets/icons/sidebar/messenger.svg?react';

interface ShareMessengerButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
}

export const ShareMessengerButton = ({
  label = '메신저에 공유',
  className,
  ...props
}: ShareMessengerButtonProps) => {
  return (
    <button
      className={cn(
        'inline-flex h-[50px] items-center justify-center gap-[9px] rounded-lg border border-dashed border-primary-500',
        'px-4 text-button text-primary-600 transition-colors',
        'hover:bg-primary-50',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        className,
      )}
      {...props}
    >
      <MessengerIcon className="h-4 w-4" />
      {label}
    </button>
  );
};
