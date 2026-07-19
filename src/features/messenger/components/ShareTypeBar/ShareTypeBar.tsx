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

const SHARE_TYPES: { type: ShareCardType; Icon: IconType; label: string }[] = [
  { type: 'chore', Icon: ChoreIcon, label: '집안일 공유' },
  { type: 'expense', Icon: ExpenseIcon, label: '정산 공유' },
  { type: 'item', Icon: ItemIcon, label: '물품 공유' },
  { type: 'rule', Icon: RuleIcon, label: '규칙 공유' },
];

export const ShareTypeBar = ({ onSelect, className }: ShareTypeBarProps) => {
  return (
    <div className={cn('flex flex-wrap items-center gap-3', className)}>
      {SHARE_TYPES.map(({ type, Icon, label }) => (
        <button
          key={type}
          type="button"
          onClick={() => onSelect(type)}
          className="flex h-[42px] items-center gap-[5px] rounded-lg border border-gray-100 bg-white px-[15px] text-caption text-gray-500 transition-colors hover:bg-gray-50"
        >
          <Icon className="h-4 w-4" />
          {label}
        </button>
      ))}
    </div>
  );
};
