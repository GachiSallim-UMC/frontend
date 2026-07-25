import EditIcon from '@/assets/icons/action/edit.svg?react';
import ShareIcon from '@/assets/icons/action/share.svg?react';
import { DataTable, StatusBadge, UserAvatar, type Column } from '@/shared/components/ui';
import type { Chore } from '../types/chore.types';

interface ChoreTableProps {
  chores: Chore[];
  onEdit?: (chore: Chore) => void;
  onShare?: (chore: Chore) => void;
}

const REPEAT_LABEL: Record<Chore['repeatType'], string> = {
  NONE: '일회성',
  DAILY: '매일',
  WEEKLY: '매주',
  MONTHLY: '매월',
  CUSTOM: '사용자 지정',
};

/**
 * 집안일 목록 테이블 — shared의 DataTable을 집안일 도메인에 맞게 조합.
 * 도메인 컴포넌트는 shared 컴포넌트를 '사용'하고, 그 반대는 금지.
 */
export const ChoreTable = ({ chores, onEdit, onShare }: ChoreTableProps) => {
  const columns: Column<Chore>[] = [
    {
      key: 'isCompleted',
      header: '완료',
      align: 'center',
      render: chore => (
        <div className="flex h-full items-center justify-center">
          <input
            type="checkbox"
            checked={chore.status === 'DONE'}
            readOnly
            className="
              h-[24px] w-[24px] cursor-pointer appearance-none rounded-[3px] 
              border border-gray-400 bg-white 
              checked:border-primary-500 checked:bg-primary-500 
              checked:bg-[url('data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMTYgMTYiIGZpbGw9IndoaXRlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Ik0xMi4yMDcgNC43OTNsLTEuNDE0LTEuNDE0TDYgOC41ODYgMy43MDcgNi4yOTNMMi4yOTMgNy43MDdsMy43MDcgMy43MDcgNy4yMDctNy4yMDd6Ii8+PC9zdmc+')]
              checked:bg-center checked:bg-no-repeat
            "
          />
        </div>
      ),
    },
    { key: 'title', header: '집안일 명' },
    {
      key: 'assignee',
      header: '담당자',
      render: chore => (
        <span className="flex items-center gap-2">
          {chore.assignee ? (
            <>
              <UserAvatar
                name={chore.assignee.nickname}
                avatarUrl={chore.assignee.avatarUrl}
                size="xs"
              />
              {chore.assignee.nickname}
            </>
          ) : (
            <span className="text-gray-400">미지정</span>
          )}
        </span>
      ),
    },
    { key: 'repeatType', header: '주기', render: chore => REPEAT_LABEL[chore.repeatType] },
    { key: 'dueDate', header: '기한' },
    {
      key: 'status',
      header: '상태',
      render: chore => <StatusBadge variant={chore.status.toLowerCase() as any} />,
    },
    {
      key: 'actions',
      header: '',
      align: 'right',
      render: chore => (
        <span className="flex justify-end gap-2 text-gray-500">
          <button onClick={() => onEdit?.(chore)} aria-label="수정">
            <EditIcon className="h-[39px] w-[39px]" />
          </button>
          <button onClick={() => onShare?.(chore)} aria-label="공유">
            <ShareIcon className="h-[39px] w-[39px]" />
          </button>
        </span>
      ),
    },
  ];

  return (
    <DataTable
      columns={columns}
      data={chores}
      className="
        border border-gray-100 overflow-hidden
        !rounded-[10px] !shadow-none 
        [&_thead]:bg-primary-50 [&_th]:h-[60px] [&_th]:py-0 [&_th]:border-gray-100
      "
    />
  );
};
