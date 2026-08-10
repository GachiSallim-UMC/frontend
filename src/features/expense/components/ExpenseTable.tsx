import {
  DataTable,
  MobileListRow,
  UserAvatar,
  StatusBadge,
  TableRowActions,
  type Column,
} from '@/shared/components/ui';
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

// 모바일 카드에서는 "07.28" 형식(점 구분)으로 표시한다 (디자인 기준).
function formatDotDate(dateString: string, order: 'MD' | 'DM'): string {
  if (!dateString) return '-';

  const date = new Date(dateString);

  if (isNaN(date.getTime())) return dateString;

  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');

  return order === 'DM' ? `${dd}.${mm}` : `${mm}.${dd}`;
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
        <span className="flex min-w-0 items-center gap-2">
          <UserAvatar
            name={row.payer?.name ?? '알 수 없음'}
            avatarUrl={row.payer?.avatarUrl}
            size="sm"
            className="size-6 shrink-0 min-[1200px]:size-8"
          />
          <span className="truncate">{row.payer?.nickname ?? '알 수 없음'}</span>
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
      render: row => (
        <TableRowActions
          onEdit={onEdit ? () => onEdit(row) : undefined}
          onShare={onShare ? () => onShare(row) : undefined}
          className="gap-1 text-gray-400"
          iconClassName="size-8 min-[1200px]:size-[39px]"
        />
      ),
    },
  ];

  const desktopTable = (
    <div className="hidden w-full lg:block">
      <DataTable
        columns={columns}
        data={expenses}
        emptyMessage="등록된 정산이 없습니다."
        className="
          border border-gray-100 overflow-hidden
          !rounded-[10px] !shadow-none
          [&_thead]:bg-primary-50 [&_th]:h-[60px] [&_th]:px-2 [&_th]:py-0 [&_th]:border-gray-100
          [&_td]:px-2 min-[1200px]:[&_th]:px-4 min-[1200px]:[&_td]:px-4
        "
      />
    </div>
  );

  if (expenses.length === 0) {
    return (
      <>
        {desktopTable}
        <div className="w-full py-16 text-center text-gray-400 lg:hidden">
          등록된 정산이 없습니다.
        </div>
      </>
    );
  }

  return (
    <>
      {/* 데스크톱: 기존 테이블 */}
      {desktopTable}

      {/* 모바일: Figma 공통 60px 목록 */}
      <div className="w-full overflow-hidden rounded-lg bg-white lg:hidden">
        {expenses.map((row, index) => (
          <MobileListRow
            key={row.id}
            isLast={index === expenses.length - 1}
            separatorClassName="after:left-4 after:right-4"
            className="px-4"
          >
            <div className="flex min-w-0 flex-1 flex-col gap-0.5">
              <span className="truncate text-mobile-label font-bold text-gray-900">
                {row.title || '제목 없음'}
              </span>
              <span className="truncate text-mobile-caption text-gray-600">
                {row.payer?.nickname ?? '알 수 없음'} ·{' '}
                {formatDotDate(row.date, dateOrder)} |{' '}
                {(row.amount ?? 0).toLocaleString()}원
              </span>
            </div>

            <StatusBadge
              variant={row.status === 'paid' ? 'done' : 'unpaid'}
              size="sm"
              className="ml-3 shrink-0"
            />

            <TableRowActions
              onEdit={onEdit ? () => onEdit(row) : undefined}
              onShare={onShare ? () => onShare(row) : undefined}
              editLabel={`${row.title || '생활비'} 수정`}
              shareLabel={`${row.title || '생활비'} 공유`}
              className="ml-2 w-14 shrink-0 items-center text-gray-400"
              iconClassName="size-7"
            />
          </MobileListRow>
        ))}
      </div>
    </>
  );
};
