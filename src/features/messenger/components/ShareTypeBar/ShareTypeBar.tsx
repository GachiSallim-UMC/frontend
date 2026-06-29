import type { ComponentType, SVGProps } from 'react';
import { cn } from '@/shared/lib/cn';
import ChoresIcon from '@/assets/icons/sidebar/chores.svg?react';
import ExpensesIcon from '@/assets/icons/sidebar/expenses.svg?react';
import ItemsIcon from '@/assets/icons/sidebar/items.svg?react';
import RulesIcon from '@/assets/icons/sidebar/rules.svg?react';

type ShareType = 'chore' | 'expense' | 'item' | 'rule';
type IconType = ComponentType<SVGProps<SVGSVGElement>>;

interface ShareTypeBarProps {
  onSelect: (type: ShareType) => void;
  className?: string;
}

const SHARE_TYPES: { type: ShareType; Icon: IconType; label: string }[] = [
  { type: 'chore', Icon: ChoresIcon, label: '집안일 공유' },
  { type: 'expense', Icon: ExpensesIcon, label: '정산 공유' },
  { type: 'item', Icon: ItemsIcon, label: '물품 공유' },
  { type: 'rule', Icon: RulesIcon, label: '규칙 공유' },
];

export const ShareTypeBar = ({ onSelect, className }: ShareTypeBarProps) => {
  return (
    <div
      className={cn(
        'flex items-center gap-2 border-t border-gray-100 bg-white px-4 py-2',
        className,
      )}
    >
      {SHARE_TYPES.map(({ type, Icon, label }) => (
        <button
          key={type}
          onClick={() => onSelect(type)}
          className="flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
        >
          <Icon className="h-3.5 w-3.5" />
          {label}
        </button>
      ))}
    </div>
  );
};
