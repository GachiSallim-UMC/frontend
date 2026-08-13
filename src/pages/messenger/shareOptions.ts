import type { Chore } from '@/features/chore';
import type { Expense } from '@/features/expense';
import type { Item } from '@/features/item';
import type { Rule } from '@/features/rule';
import type { ChatShareCard, ShareableOption, ShareCardType } from '@/features/messenger';
import { josa } from '@/shared/lib';

export interface ShareSourceData {
  chores: Chore[];
  expenses: Expense[];
  items: Item[];
  rules: Rule[];
}

export interface ExpenseShareActionState {
  actionLabel: string;
  actionHidden?: boolean;
  actionDisabled?: boolean;
}

/** 현재 사용자의 역할과 분담 상태에 맞는 메신저 생활비 카드 액션을 계산합니다. */
export const getExpenseShareActionState = (
  expense: Expense,
  currentUserId: string,
): ExpenseShareActionState => {
  const isPayer = Boolean(currentUserId) && String(expense.payer.id) === String(currentUserId);
  const myShare = expense.shares.find(share => String(share.user.id) === String(currentUserId));
  const pendingShares = expense.shares.filter(share => share.isPending && !share.isPaid);
  const isSettled =
    expense.status === 'paid' ||
    (expense.shares.length > 0 && expense.shares.every(share => share.isPaid));

  if (!isPayer && !myShare) return { actionLabel: '', actionHidden: true };
  if (isSettled) return { actionLabel: '정산 완료', actionDisabled: true };

  if (isPayer) {
    return pendingShares.length > 0
      ? { actionLabel: '정산 확인' }
      : { actionLabel: '송금 대기 중', actionDisabled: true };
  }

  if (!myShare) return { actionLabel: '', actionHidden: true };
  if (myShare.isPaid) return { actionLabel: '정산 완료', actionDisabled: true };
  if (myShare.isPending) return { actionLabel: '확인 대기 중', actionDisabled: true };

  return { actionLabel: '송금 완료했어요' };
};

const REPEAT_LABEL: Record<Chore['repeatType'], string> = {
  once: '반복 없음',
  daily: '매일',
  weekly: '매주',
  monthly: '매월',
  custom: '사용자 지정',
};

const ITEM_STATUS_LABEL: Record<Item['status'], string> = {
  enough: '충분',
  short: '부족',
  empty: '소진',
  purchased: '구매완료',
};

/** 공유 버튼으로 선택한 타입에 해당하는, 채팅방에 공유할 수 있는 항목 목록 */
export const getShareOptions = (type: ShareCardType, data: ShareSourceData): ShareableOption[] => {
  switch (type) {
    case 'chore':
      return data.chores.map(chore => ({
        id: chore.id,
        title: chore.name,
        subtitle: `담당: ${chore.assignee.name}`,
      }));
    case 'expense':
      return data.expenses.map(expense => ({
        id: expense.id,
        title: expense.title,
        subtitle: `${expense.amount.toLocaleString()}원 · ${expense.payer.name} 선지불`,
      }));
    case 'item':
      return data.items.map(item => ({
        id: item.id,
        title: item.name,
        subtitle: ITEM_STATUS_LABEL[item.status],
      }));
    case 'rule':
      return data.rules.map(rule => ({
        id: rule.id,
        title: rule.title,
        subtitle: `${rule.agreement.agreedCount}/${rule.agreement.totalCount}명 동의`,
      }));
    default:
      return [];
  }
};

/** 선택된 항목을 채팅에 올릴 공유 카드 데이터로 변환 */
export const buildShareCard = (
  type: ShareCardType,
  optionId: string,
  data: ShareSourceData,
): ChatShareCard | null => {
  switch (type) {
    case 'chore': {
      const chore = data.chores.find(item => item.id === optionId);
      if (!chore) return null;
      return {
        type: 'chore',
        title: chore.name,
        headline: `${josa(chore.name, '이', '가')} 등록됐어요`,
        details: [
          { label: `담당: ${chore.assignee.name}` },
          { label: `반복: ${REPEAT_LABEL[chore.repeatType]}` },
        ],
        actionLabel: '완료 처리',
      };
    }
    case 'expense': {
      const expense = data.expenses.find(item => item.id === optionId);
      if (!expense) return null;
      const perPerson = Math.floor(expense.amount / (expense.shares.length || 1));
      return {
        type: 'expense',
        title: expense.title,
        headline: ' 정산을 공유했어요',
        details: [
          { label: '총액', value: `${expense.amount.toLocaleString()}원` },
          { label: '분담 방식', value: expense.splitType === 'EQUAL' ? '균등 분할' : '비율 분할' },
          { label: '1인당 금액', value: `${perPerson.toLocaleString()}원` },
        ],
        actionLabel: '정산하기',
      };
    }
    case 'item': {
      const item = data.items.find(entry => entry.id === optionId);
      if (!item) return null;
      return {
        type: 'item',
        title: item.name,
        headline: `${josa(item.name, '이', '가')} ${item.status === 'empty' ? '소진됐어요' : '부족해요'}`,
        details: [{ label: `구매 담당: ${item.buyer?.name ?? '미지정'}` }],
        actionLabel: '구매 완료',
      };
    }
    case 'rule': {
      const rule = data.rules.find(item => item.id === optionId);
      if (!rule) return null;
      return {
        type: 'rule',
        title: '새 규칙',
        headline: '이 등록됐어요',
        details: [{ label: rule.title }],
        actionLabel: '동의하기',
      };
    }
    default:
      return null;
  }
};
