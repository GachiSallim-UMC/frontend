import { Link } from 'react-router-dom';
import EditIcon from '@/assets/icons/action/edit.svg?react';
import ShareIcon from '@/assets/icons/action/share.svg?react';
import { DataTable, StatusBadge, UserAvatar, type Column } from '@/shared/components/ui';
import { formatDate, useDateFormat } from '@/shared/lib';
import { ITEM_CATEGORY_LABEL } from '../hooks/useItemFilters';
import type { Item, ItemCategory } from '../types/item.types';

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
        <span className="flex justify-end text-gray-400">
          <Link
            to={`/items/${item.id}/edit`}
            aria-label={`${item.name} 수정`}
            className="flex size-[39px] items-center justify-center transition-colors hover:text-gray-500"
          >
            <EditIcon className="size-[39px]" />
          </Link>
          <button
            type="button"
            aria-label={`${item.name} 공유`}
            onClick={() => onShare?.(item)}
            className="flex size-[39px] items-center justify-center transition-colors hover:text-gray-500"
          >
            <ShareIcon className="size-[39px]" />
          </button>
        </span>
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
            <div
              key={item.id}
              className={`relative grid grid-cols-[minmax(0,1fr)_52px_56px] items-center gap-3 px-4 ${
                isLast
                  ? 'h-[60px]'
                  : 'h-[62px] after:absolute after:bottom-0 after:left-4 after:right-4 after:h-px after:bg-gray-100'
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
                className="h-[26px] w-[52px] px-0 text-mobile-caption leading-normal"
              />
              <span className="flex items-center text-gray-200">
                <Link
                  to={`/items/${item.id}/edit`}
                  aria-label={`${item.name} 수정`}
                  className="flex size-7 items-center justify-center transition-colors hover:text-gray-500"
                >
                  <EditIcon className="size-7" />
                </Link>
                <button
                  type="button"
                  aria-label={`${item.name} 공유`}
                  onClick={() => onShare?.(item)}
                  className="flex size-7 items-center justify-center transition-colors hover:text-gray-500"
                >
                  <ShareIcon className="size-7" />
                </button>
              </span>
            </div>
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
