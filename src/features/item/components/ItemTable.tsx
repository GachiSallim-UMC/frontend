import {
  DataTable,
  MobileListRow,
  StatusBadge,
  TableRowActions,
  UserAvatar,
  type Column,
} from '@/shared/components/ui';
import { formatDate, useDateFormat } from '@/shared/lib';
import { ITEM_CATEGORY_LABEL } from '@/features/item/hooks/useItemFilters';
import type { Item, ItemCategory } from '@/features/item/types/item.types';

interface ItemTableProps {
  items: Item[];
  onShare?: (item: Item) => void;
}

const MOBILE_CATEGORY_LABEL: Record<ItemCategory, string> = {
  daily: '생필품',
  bathroom: '욕실',
  kitchen: '주방',
  cleaning: '세탁/청소',
  grocery: '식료품',
  medicine: '의약/위생',
  pet: '반려동물/식물',
  tool: '공구/기타',
  etc: '기타',
};

export const ItemTable = ({ items, onShare }: ItemTableProps) => {
  const dateFormat = useDateFormat();
  const columns: Column<Item>[] = [
    { key: 'name', header: '물품명' },
    {
      key: 'category',
      header: '카테고리',
      render: item => ITEM_CATEGORY_LABEL[item.category],
    },
    {
      key: 'buyer',
      header: '구매 담당',
      render: item =>
        item.buyer ? (
          <span className="flex min-w-0 items-center gap-2">
            <UserAvatar
              name={item.buyer.name}
              avatarUrl={item.buyer.avatarUrl}
              size="xs"
            />
            <span className="truncate">{item.buyer.name}</span>
          </span>
        ) : (
          <span className="text-gray-400">미지정</span>
        ),
    },
    {
      key: 'updatedAt',
      header: '마지막 변경',
      render: item => formatDate(item.updatedAt, dateFormat),
    },
    {
      key: 'status',
      header: '현재 상태',
      render: item => <StatusBadge variant={item.status} />,
    },
    {
      key: 'actions',
      header: '',
      align: 'right',
      render: item => (
        <TableRowActions
          editTo={`/items/${item.id}/edit`}
          onShare={onShare ? () => onShare(item) : undefined}
          editLabel={`${item.name} 수정`}
          shareLabel={`${item.name} 공유`}
          className="text-gray-400"
          actionClassName="size-[39px]"
          iconClassName="size-[39px]"
        />
      ),
    },
  ];

  return (
  <>
    <div className="w-full overflow-hidden rounded-lg bg-white lg:hidden">
      {items.length === 0 ? (
        <p className="flex h-[120px] items-center justify-center text-mobile-label text-gray-400">
          등록된 공용 물품이 없습니다.
        </p>
      ) : (
        items.map((item, index) => {
          const isLast = index === items.length - 1;

          return (
            <MobileListRow
              key={item.id}
              isLast={isLast}
              separatorClassName="after:left-4 after:right-4"
              className={`relative grid grid-cols-[minmax(0,1fr)_52px_56px] items-center gap-3 px-4 ${
                isLast
                  ? 'h-[60px]'
                  : 'h-[62px]'
              }`}
            >
              <span className="flex min-w-0 flex-col gap-0.5">
                <span className="truncate text-mobile-label font-bold text-gray-900">
                  {item.name}
                </span>
                <span className="truncate text-mobile-caption text-gray-600">
                  {MOBILE_CATEGORY_LABEL[item.category]} ㅣ 담당: {item.buyer?.name ?? '미지정'}
                </span>
              </span>
              <StatusBadge
                variant={item.status}
                size="sm"
                className="shrink-0"
              />
              <TableRowActions
                editTo={`/items/${item.id}/edit`}
                onShare={onShare ? () => onShare(item) : undefined}
                editLabel={`${item.name} 수정`}
                shareLabel={`${item.name} 공유`}
                className="items-center text-gray-200"
                actionClassName="size-7"
                iconClassName="size-7"
              />
            </MobileListRow>
          );
        })
      )}
    </div>

    <div className="hidden w-full lg:block">
      <DataTable
        columns={columns}
        data={items}
        emptyMessage="등록된 공용 물품이 없습니다."
        className="max-h-[428px] overflow-auto border border-gray-100 !rounded-[10px] !shadow-none [&_thead]:bg-primary-50 [&_th]:sticky [&_th]:top-0 [&_th]:z-10 [&_th]:h-[60px] [&_th]:border-gray-100 [&_th]:bg-primary-50 [&_th]:py-0"
      />
    </div>
  </>
  );
};
