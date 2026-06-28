import type { ReactNode } from 'react';
import { cn } from '@/shared/lib/cn';

interface SummaryCardProps {
  icon: ReactNode;
  /** 아이콘 원형 배경 색 클래스 (Figma 카드별 색, 기본 primary-50) */
  iconBg?: string;
  label: string;
  value: ReactNode;
  subText?: ReactNode;
  onClick?: () => void;
  className?: string;
}

export const SummaryCard = ({
  icon,
  iconBg,
  label,
  value,
  subText,
  onClick,
  className,
}: SummaryCardProps) => {
  return (
    <div
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={onClick ? e => e.key === 'Enter' && onClick() : undefined}
      className={cn(
        'flex items-center gap-4 rounded-[18px] bg-white p-5 shadow-card',
        onClick && 'cursor-pointer transition-shadow hover:shadow-md',
        className,
      )}
    >
      <div
        className={cn(
          'flex h-14 w-14 shrink-0 items-center justify-center rounded-full text-primary-600',
          iconBg ?? 'bg-primary-50',
        )}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <p className="text-caption font-bold text-gray-500">{label}</p>
        <p className="mt-0.5 text-key-number font-bold text-gray-900">{value}</p>
        {subText && <p className="mt-0.5 text-caption text-gray-500">{subText}</p>}
      </div>
    </div>
  );
};
