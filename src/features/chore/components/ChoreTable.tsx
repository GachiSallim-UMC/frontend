import { DataTable, StatusBadge, UserAvatar, type Column } from '@/shared/components/ui';
import EditIcon from '@/assets/icons/action/edit.svg?react';
import ShareIcon from '@/assets/icons/action/share.svg?react';
import type { Chore } from '../types/chore.types';

interface ChoreTableProps {
  chores: Chore[];
  onEdit?: (chore: Chore) => void;
  onShare?: (chore: Chore) => void;
}

const REPEAT_LABEL: Record<Chore['repeatType'], string> = {
  once: '일회성',
  daily: '매일',
  weekly: '매주',
  monthly: '매월',
};

/**
 * 집안일 목록 테이블 — shared의 DataTable을 집안일 도메인에 맞게 조합.
 * 도메인 컴포넌트는 shared 컴포넌트를 '사용'하고, 그 반대는 금지.
 */
export const ChoreTable = ({ chores, onEdit, onShare }: ChoreTableProps) => {
  const columns: Column<Chore>[] = [
    { key: 'name', header: '집안일 명' },
    {
      key: 'assignee',
      header: '담당자',
      render: chore => (
        <span className="flex items-center gap-2">
          <UserAvatar name={chore.assignee.name} avatarUrl={chore.assignee.avatarUrl} size="xs" />
          {chore.assignee.name}
        </span>
      ),
    },
    { key: 'repeatType', header: '주기', render: chore => REPEAT_LABEL[chore.repeatType] },
    { key: 'startDate', header: '기한' },
    { key: 'status', header: '상태', render: chore => <StatusBadge variant={chore.status} /> },
    {
      key: 'actions',
      header: '',
      align: 'right',
      render: chore => (
        <span className="flex justify-end gap-2 text-gray-500">
          <button onClick={() => onEdit?.(chore)} aria-label="수정">
            <EditIcon className="h-4 w-4" />
          </button>
          <button onClick={() => onShare?.(chore)} aria-label="공유">
            <ShareIcon className="h-4 w-4" />
          </button>
        </span>
      ),
    },
  ];

  return <DataTable columns={columns} data={chores} emptyMessage="등록된 집안일이 없습니다." />;
};
