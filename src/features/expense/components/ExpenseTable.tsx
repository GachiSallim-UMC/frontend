import EditIcon from '@/assets/icons/action/edit.svg?react';
import ShareIcon from '@/assets/icons/action/share.svg?react';
import { DataTable, UserAvatar, StatusBadge, type Column } from '@/shared/components/ui';
import { useDateFormat } from '@/shared/lib';
import type { Expense } from '@/features/expense';

interface ExpenseTableProps {
  expenses: Expense[];
  onEdit?: (expense: Expense) => void;
  onShare?: (expense: Expense) => void;
  onDelete?: (expense: Expense) => void;
}

const SPLIT_TYPE_LABEL: Record<string, string> = {
  EQUAL: '균등 분할 (n/n)',
  CUSTOM: '직접 입력',
  RATIO: '비율 분할',
};

// 표에는 연도 없이 월/일만 표시하되, 전역 날짜 형식의 순서(월-일 vs 일-월)는 반영한다.
function formatShortDate(dateString: string, order: 'MD' | 'DM'): string {
  if (!dateString) return '-';

  const date = new Date(dateString);

  if (isNaN(date.getTime())) return dateString;

  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');

  return order === 'DM' ? `${dd}/${mm}` : `${mm}/${dd}`;
}

export const ExpenseTable = ({ expenses, onEdit, onShare }: ExpenseTableProps) => {
  const dateFormat = useDateFormat();
  const dateOrder = dateFormat === 'DD/MM/YY' ? 'DM' : 'MD';

  const columns: Column<Expense>[] = [
    {
      key: 'date',
      header: '날짜',
      render: (row) => formatShortDate(row.date, dateOrder),
    },
    {
      key: 'title',
      header: '항목',
      render: (row) => row.title || '제목 없음',
    },
    {
      key: 'payer',
      header: '지불자',
      render: (row) => (
        <span className="flex items-center gap-2">
          <UserAvatar
            name={row.payer?.name ?? '알 수 없음'}
            avatarUrl={row.payer?.avatarUrl}
            size="sm"
          />
          {row.payer?.nickname ?? '알 수 없음'}
        </span>
      ),
    },
    {
      key: 'amount',
      header: '총액',
      render: (row) => `${(row.amount ?? 0).toLocaleString()}원`,
    },
    {
      key: 'splitType',
      header: '분담 방식',
      render: (row) =>
        SPLIT_TYPE_LABEL[row.splitType] ?? '균등 분할 (n/n)',
    },
    {
      key: 'status',
      header: '상태',
      align: 'center',
      render: (row) => (
        <StatusBadge
          variant={row.status === 'paid' ? 'done' : 'unpaid'}
        />
      ),
    },
    {
      key: 'actions',
      header: '',
      align: 'right',
      render: (row) => (
        <span className="flex justify-end gap-2 text-gray-500">
          <button onClick={() => onEdit?.(row)} aria-label="수정">
            <EditIcon className="h-[39px] w-[39px]" />
          </button>
          <button onClick={() => onShare?.(row)} aria-label="공유">
            <ShareIcon className="h-[39px] w-[39px]" />
          </button>
        </span>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={expenses}
      emptyMessage="등록된 정산이 없습니다."
      className="
        border border-gray-100 overflow-hidden
        !rounded-[10px] !shadow-none
        [&_thead]:bg-primary-50 [&_th]:h-[60px] [&_th]:py-0 [&_th]:border-gray-100
      "
    />
  );
};