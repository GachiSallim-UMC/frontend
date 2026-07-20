import type { Expense } from '@/features/expense/types/expense.types';
import type { User } from '@/shared/types';
import avatar1 from '@/assets/avatars/avatar-1.png';
import avatar2 from '@/assets/avatars/avatar-2.png';
import avatar3 from '@/assets/avatars/avatar-3.png';

const kim: User = {
  id: 'user-1',
  name: '김영희',
  nickname: '영희',
  email: 'kim@example.com',
  avatarUrl: avatar1,
};

const hong: User = {
  id: 'user-2',
  name: '홍길동',
  nickname: '길동',
  email: 'hong@example.com',
  avatarUrl: avatar2,
};

const lee: User = {
  id: 'user-3',
  name: '이철수',
  nickname: '철수',
  email: 'lee@example.com',
  avatarUrl: avatar3,
};

export const mockExpenses: Expense[] = [
  {
    id: 'expense-1',
    title: '마트 장보기',
    amount: 32000,
    payer: kim,
    date: '07/28',
    splitType: 'equal',
    category: 'food',
    status: 'unpaid',
    shares: [],
  },
  {
    id: 'expense-2',
    title: '인터넷 요금',
    amount: 30000,
    payer: hong,
    date: '07/25',
    splitType: 'equal',
    category: 'finance',
    status: 'unpaid',
    shares: [],
  },
  {
    id: 'expense-3',
    title: '전기요금',
    amount: 54000,
    payer: lee,
    date: '07/20',
    splitType: 'equal',
    category: 'finance',
    status: 'paid',
    shares: [],
  },
  {
    id: 'expense-4',
    title: '욕실 용품 구매',
    amount: 21000,
    payer: kim,
    date: '07/15',
    splitType: 'ratio',
    category: 'living',
    status: 'paid',
    shares: [],
  },
];