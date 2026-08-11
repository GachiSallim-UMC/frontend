import EditIcon from '@/assets/icons/action/edit.svg?react';
import ShareIcon from '@/assets/icons/action/share.svg?react';
import {
  DataTable,
  UserAvatar,
  StatusBadge,
  TableRowActions,
  type Column,
} from '@/shared/components/ui';
import { useDateFormat } from '@/shared/lib';
import type { Expense } from '@/features/expense/types';

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
      render: row => (
        <TableRowActions
          onEdit={onEdit ? () => onEdit(row) : undefined}
          onShare={onShare ? () => onShare(row) : undefined}
          className="gap-1"
          iconClassName="h-[39px] w-[39px] text-gray-400"
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
          [&_thead]:bg-primary-50 [&_th]:h-[60px] [&_th]:py-0 [&_th]:border-gray-100
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

      {/* 모바일: 카드 리스트 */}
      <div className="flex w-full flex-col gap-3 lg:hidden">
        {expenses.map(row => (
          <div
            key={row.id}
            className="w-full rounded-[12px] border border-gray-100 px-4 py-3.5"
          >
            <div className="flex w-full items-center gap-2">
              {/* 왼쪽: 제목 + 부제목(지불자·날짜·금액) 세로 스택 */}
              <div className="min-w-0 flex-1">
                <div className="truncate text-[15px] font-bold text-gray-900">
                  {row.title || '제목 없음'}
                </div>

                {/* truncate 제거: 잘리지 않고 필요하면 자연스럽게 줄바꿈되도록 처리 */}
                <div className="mt-1.5 text-[13px] leading-[18px] text-gray-500">
                  {row.payer?.nickname ?? '알 수 없음'} 선지불 |{' '}
                  {(row.amount ?? 0).toLocaleString()}원 ·{' '}
                  {formatDotDate(row.date, dateOrder)}
                </div>
              </div>

              {/* 오른쪽: 배지 + 아이콘, 왼쪽 블록 전체 높이 기준으로 세로 중앙 정렬 */}
              <div className="flex shrink-0 items-center gap-2 self-center">
                <StatusBadge
                  variant={row.status === 'paid' ? 'done' : 'unpaid'}
                  size="sm"
                />

                <span className="flex items-center gap-1 text-gray-400">
                  <button
                    type="button"
                    onClick={() => onEdit?.(row)}
                    aria-label="수정"
                    className="flex items-center justify-center p-0.5"
                  >
                    <EditIcon className="h-[28px] w-[28px]" />
                  </button>

                  <button
                    type="button"
                    onClick={() => onShare?.(row)}
                    aria-label="공유"
                    className="flex items-center justify-center p-0.5"
                  >
                    <ShareIcon className="h-[28px] w-[28px]" />
                  </button>
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};
