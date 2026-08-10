import type { ExpenseCategory, SettlementMethod } from '@/features/expense/types';

export const MEMO_MAX_LENGTH = 255;
export const MAX_EXPENSE_AMOUNT = 2_147_483_647;

const toLocalDateOnly = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const TODAY_DATE_ONLY = toLocalDateOnly(new Date());

export const CATEGORY_OPTIONS: ReadonlyArray<{
  value: ExpenseCategory;
  label: string;
}> = [
  { value: 'FINANCE', label: '세금/기타금융' },
  { value: 'FOOD', label: '식비' },
  { value: 'SHOPPING', label: '쇼핑' },
  { value: 'EDUCATION', label: '교육' },
  { value: 'GROCERY', label: '편의점/마트/잡화' },
  { value: 'TRANSPORT', label: '교통/자동차' },
  { value: 'LEISURE', label: '취미/여가' },
  { value: 'CAFE', label: '카페/간식' },
  { value: 'UTILITIES', label: '공과금/생활' },
  { value: 'ETC', label: '기타' },
];

export const SPLIT_METHOD_OPTIONS: ReadonlyArray<{
  value: SettlementMethod;
  label: string;
}> = [
  { value: 'EQUAL', label: '균등 분할 (n/n)' },
  { value: 'CUSTOM', label: '직접 입력' },
  { value: 'RATIO', label: '비율 분할 (%)' },
];

export const formatWon = (value: number): string => `${value.toLocaleString()}원`;
