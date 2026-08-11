import {
  DataTable,
  MobileListRow,
  StatusBadge,
  TableRowActions,
  UserAvatar,
  type Column,
} from '@/shared/components/ui';
import type { Chore } from '../types/chore.types';
import { getChoreUIStatus } from '../hooks/useChoreStatus';

interface ChoreTableProps {
  chores: Chore[];
  mobileChores?: Chore[];
  onEdit?: (chore: Chore) => void;
  onShare?: (chore: Chore) => void;
  onToggleComplete?: (chore: Chore) => void;
  isUpdating?: boolean;
}

const REPEAT_LABEL: Record<Chore['repeatType'], string> = {
  once: '일회성',
  daily: '매일',
  weekly: '매주',
  monthly: '매월',
  custom: '사용자 지정',
};

export const ChoreTable = ({
  chores,
  mobileChores = chores,
  onEdit,
  onShare,
  onToggleComplete,
  isUpdating,
}: ChoreTableProps) => {
  const columns: Column<Chore>[] = [
    {
      key: 'isCompleted',
      header: '완료',
      align: 'center',
      render: chore => (
        <div className="flex h-full items-center justify-center">
          <input
            type="checkbox"
            checked={getChoreUIStatus(chore) === 'done'}
            onChange={() => onToggleComplete?.(chore)}
            disabled={isUpdating}
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
    {
      key: 'startDate',
      header: '기한',
      render: chore => chore.endDate || chore.startDate,
    },
    {
      key: 'status',
      header: '상태',
      render: chore => <StatusBadge variant={getChoreUIStatus(chore)} />,
    },
    {
      key: 'actions',
      header: '',
      align: 'right',
      render: chore => (
        <TableRowActions
          onEdit={onEdit ? () => onEdit(chore) : undefined}
          onShare={onShare ? () => onShare(chore) : undefined}
          className="gap-0 text-gray-400"
        />
      ),
    },
  ];

  return (
    <>
      {/**모바일 뷰 */}
      <div className="flex flex-col rounded-xl bg-white px-[16px] lg:hidden">
        {mobileChores.length === 0 ? (
          <div className="py-[40px] text-center text-[12px] text-gray-400">
            등록된 집안일이 없습니다.
          </div>
        ) : (
          mobileChores.map((chore, index) => (
            <MobileListRow
              key={chore.id}
              isLast={index === mobileChores.length - 1}
              separatorClassName="after:left-0 after:right-0"
              className="gap-[10px] py-[16px]"
            >
              <div className="flex shrink-0 items-center justify-center">
                <input
                  type="checkbox"
                  checked={getChoreUIStatus(chore) === 'done'}
                  onChange={() => onToggleComplete?.(chore)}
                  disabled={isUpdating}
                  className="
                    h-[16px] w-[16px] cursor-pointer appearance-none rounded-[3px] 
                    border border-gray-400 bg-white 
                    checked:border-primary-500 checked:bg-primary-500 
                    checked:bg-[url('data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMTYgMTYiIGZpbGw9IndoaXRlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Ik0xMi4yMDcgNC43OTNsLTEuNDE0LTEuNDE0TDYgOC41ODYgMy43MDcgNi4yOTNMMi4yOTMgNy43MDdsMy43MDcgMy43MDcgNy4yMDctNy4yMDd6Ii8+PC9zdmc+')]
                    checked:bg-center checked:bg-no-repeat
                  "
                />
              </div>
              <UserAvatar
                name={chore.assignee.name}
                avatarUrl={chore.assignee.avatarUrl}
                size="xs"
              />
              <div className="flex min-w-0 flex-1 flex-col gap-0">
                <span className="truncate text-[12px] text-gray-900 font-bold">{chore.name}</span>
                <span className="truncate text-[10px] text-gray-600">
                  {chore.assignee.name} | {REPEAT_LABEL[chore.repeatType]} |{' '}
                  {chore.endDate || chore.startDate}
                </span>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <StatusBadge variant={getChoreUIStatus(chore)} size="sm" />
                <TableRowActions
                  onEdit={onEdit ? () => onEdit(chore) : undefined}
                  onShare={onShare ? () => onShare(chore) : undefined}
                  editLabel={`${chore.name} 수정`}
                  shareLabel={`${chore.name} 공유`}
                  className="items-center text-gray-400"
                  iconClassName="size-7 fill-current"
                />
              </div>
            </MobileListRow>
          ))
        )}
      </div>

      {/*데스크탑 뷰 */}
      <div className="hidden lg:block">
        <DataTable
          columns={columns}
          data={chores}
          emptyMessage="등록된 집안일이 없습니다."
          className="
            border border-gray-100 overflow-hidden
            !rounded-[10px] !shadow-none 
            [&_thead]:bg-primary-50 [&_th]:h-[60px] [&_th]:py-0 [&_th]:border-gray-100
          "
        />
      </div>
    </>
  );
};
