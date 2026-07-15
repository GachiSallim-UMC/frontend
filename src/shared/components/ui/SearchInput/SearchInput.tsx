import type { InputHTMLAttributes } from 'react';
import { Search } from 'lucide-react';
import { cn } from '@/shared/lib/cn';

interface SearchInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  className?: string;
}

export const SearchInput = ({ className, ...props }: SearchInputProps) => {
  return (
    <div className={cn('relative', className)}>
      <Search
        size={16}
        className="absolute right-[22px] top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
      />
      <input
        type="search"
        className={cn(
          'h-[50px] w-full rounded-lg border border-gray-100 bg-white pl-[24px] pr-[46px]',
          'text-button text-gray-700 placeholder:text-gray-400',
          'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
          'transition-colors',
        )}
        {...props}
      />
    </div>
  );
};
