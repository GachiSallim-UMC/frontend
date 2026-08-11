import type { ReactNode } from 'react';
import { cn } from '@/shared/lib';

interface MobileListRowProps {
  children: ReactNode;
  isLast?: boolean;
  className?: string;
  separatorClassName?: string;
}

/** 모바일 도메인 목록에서 공통으로 사용하는 행 높이와 구분선 골격입니다. */
export const MobileListRow = ({
  children,
  isLast = false,
  className,
  separatorClassName,
}: MobileListRowProps) => (
  <div
    className={cn(
      'relative flex min-h-[60px] items-center',
      !isLast &&
        'after:absolute after:bottom-0 after:h-px after:bg-gray-100 after:content-[\'\']',
      !isLast && separatorClassName,
      className,
    )}
  >
    {children}
  </div>
);
