import type { ComponentType, SVGProps } from 'react';
import { cn } from '@/shared/lib/cn';
import type { ShareCardType } from '@/features/messenger/types';
import ChoreIcon from '@/assets/icons/messenger/chore.svg?react';
import ExpenseIcon from '@/assets/icons/messenger/expense.svg?react';
import ItemIcon from '@/assets/icons/messenger/item.svg?react';
import RuleIcon from '@/assets/icons/messenger/rule.svg?react';

type IconType = ComponentType<SVGProps<SVGSVGElement>>;

interface ShareTypeBarProps {
  onSelect: (type: ShareCardType) => void;
  className?: string;
}

const SHARE_TYPES: { type: ShareCardType; Icon: IconType; label: string; mobileLabel: string }[] = [
  { type: 'chore', Icon: ChoreIcon, label: '집안일 공유', mobileLabel: '집안일' },
  { type: 'expense', Icon: ExpenseIcon, label: '정산 공유', mobileLabel: '정산' },
  { type: 'item', Icon: ItemIcon, label: '물품 공유', mobileLabel: '물품' },
  { type: 'rule', Icon: RuleIcon, label: '규칙 공유', mobileLabel: '규칙' },
];

export const ShareTypeBar = ({ onSelect, className }: ShareTypeBarProps) => {
  return (
    <div className={cn('flex flex-wrap items-center gap-1.5 lg:gap-3', className)}>
      {SHARE_TYPES.map(({ type, Icon, label, mobileLabel }) => (
        <button
          key={type}
          type="button"
          onClick={() => onSelect(type)}
          className="flex h-7 items-center gap-1 rounded-lg border border-gray-100 bg-white px-2 text-[11px] text-gray-500 transition-colors hover:bg-gray-50 lg:h-[42px] lg:gap-[5px] lg:px-[15px] lg:text-caption"
        >
          <Icon className="h-3.5 w-3.5 lg:h-4 lg:w-4" />
          <span className="lg:hidden">{mobileLabel}</span>
          <span className="hidden lg:inline">{label}</span>
        </button>
      ))}
    </div>
  );
};
