import type { ComponentType, SVGProps } from 'react';
import { Button } from '@/shared/components/ui/Button';
import { cn } from '@/shared/lib/cn';
import ChoresIcon from '@/assets/icons/sidebar/chores.svg?react';
import ExpensesIcon from '@/assets/icons/sidebar/expenses.svg?react';
import ItemsIcon from '@/assets/icons/sidebar/items.svg?react';
import RulesIcon from '@/assets/icons/sidebar/rules.svg?react';

type ShareCardType = 'chore' | 'expense' | 'item' | 'rule';
type IconType = ComponentType<SVGProps<SVGSVGElement>>;

interface ShareCardProps {
  type: ShareCardType;
  title: string;
  description: string;
  onViewDetail?: () => void;
  onAction?: () => void;
  actionLabel?: string;
  className?: string;
}

const typeConfig: Record<ShareCardType, { Icon: IconType; color: string; label: string }> = {
  chore: { Icon: ChoresIcon, color: 'text-purple-700 bg-purple-100', label: '집안일 공유' },
  expense: { Icon: ExpensesIcon, color: 'text-primary-700 bg-primary-100', label: '생활비 공유' },
  item: { Icon: ItemsIcon, color: 'text-green-700 bg-green-100', label: '공용 물품 공유' },
  rule: { Icon: RulesIcon, color: 'text-orange-700 bg-orange-100', label: '규칙 공유' },
};

export const ShareCard = ({
  type,
  title,
  description,
  onViewDetail,
  onAction,
  actionLabel,
  className,
}: ShareCardProps) => {
  const config = typeConfig[type];
  const { Icon } = config;

  return (
    <div className={cn('rounded-xl border border-gray-200 bg-white p-3', className)}>
      <div
        className={cn(
          'mb-2 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium',
          config.color,
        )}
      >
        <Icon className="h-3.5 w-3.5" />
        {config.label}
      </div>
      <p className="text-sm font-semibold text-gray-900">{title}</p>
      <p className="mt-0.5 text-xs text-gray-500">{description}</p>
      <div className="mt-3 flex gap-2">
        {onViewDetail && (
          <Button variant="secondary" size="sm" onClick={onViewDetail}>
            상세 보기
          </Button>
        )}
        {onAction && actionLabel && (
          <Button variant="primary" size="sm" onClick={onAction}>
            {actionLabel}
          </Button>
        )}
      </div>
    </div>
  );
};
