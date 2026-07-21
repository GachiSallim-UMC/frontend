import type { ComponentType, SVGProps } from 'react';
import type { ShareCardType } from '@/features/messenger/types';
import ChoreIcon from '@/assets/icons/messenger/chore.svg?react';
import ExpenseIcon from '@/assets/icons/messenger/expense.svg?react';
import ItemIcon from '@/assets/icons/messenger/item.svg?react';
import RuleIcon from '@/assets/icons/messenger/rule.svg?react';

type IconType = ComponentType<SVGProps<SVGSVGElement>>;

export interface ShareCardStyle {
  Icon: IconType;
  label: string;
  headerBg: string;
  accent: string;
  outline: string;
  fill: string;
}

export const SHARE_CARD_STYLE: Record<ShareCardType, ShareCardStyle> = {
  expense: {
    Icon: ExpenseIcon,
    label: '생활비 공유',
    headerBg: 'bg-orange-100',
    accent: 'text-orange-700',
    outline: 'border-orange-500 text-orange-500',
    fill: 'bg-orange-100 text-orange-500',
  },
  item: {
    Icon: ItemIcon,
    label: '물품 공유',
    headerBg: 'bg-mint-100',
    accent: 'text-mint-700',
    outline: 'border-mint-700 text-mint-700',
    fill: 'bg-mint-100 text-mint-700',
  },
  chore: {
    Icon: ChoreIcon,
    label: '집안일 공유',
    headerBg: 'bg-primary-100',
    accent: 'text-primary-700',
    outline: 'border-primary-700 text-primary-700',
    fill: 'bg-primary-100 text-primary-700',
  },
  rule: {
    Icon: RuleIcon,
    label: '규칙 공유',
    headerBg: 'bg-primary-200',
    accent: 'text-primary-700',
    outline: 'border-primary-700 text-primary-700',
    fill: 'bg-primary-200 text-primary-700',
  },
};
