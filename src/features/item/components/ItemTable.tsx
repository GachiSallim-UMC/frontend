import { Link } from 'react-router-dom';
import EditIcon from '@/assets/icons/action/edit.svg?react';
import ShareIcon from '@/assets/icons/action/share.svg?react';
import { StatusBadge, UserAvatar } from '@/shared/components/ui';
import { formatDate, useDateFormat } from '@/shared/lib';
import { ITEM_CATEGORY_LABEL } from '../hooks/useItemFilters';
import type { Item } from '../types/item.types';

interface ItemTableProps {
  items: Item[];
}

const GRID_COLUMNS = 'grid-cols-[1.24fr_1.15fr_1.58fr_1.25fr_1.71fr_1fr]';

export const ItemTable = ({ items }: ItemTableProps) => {
  const dateFormat = useDateFormat();

  return (
  <div className="flex h-[428px] w-full flex-col overflow-hidden rounded-[10px] border border-gray-100 bg-white">
    <div
      className={`grid h-[60px] shrink-0 ${GRID_COLUMNS} items-center border-b border-gray-100 bg-primary-50 pr-[5px] text-caption font-bold text-gray-500`}
    >
      <span className="pl-[30px]">물품명</span>
      <span className="pl-[30px]">카테고리</span>
      <span className="pl-[30px]">구매 담당</span>
      <span className="pl-[30px]">마지막 변경</span>
      <span className="pl-[30px]">현재 상태</span>
      <span aria-hidden="true" />
    </div>

    <div className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto [scrollbar-gutter:stable] [&::-webkit-scrollbar]:w-[5px]">
      {items.length === 0 ? (
        <p className="flex h-full items-center justify-center text-gray-400">
          등록된 공용 물품이 없습니다.
        </p>
      ) : (
        <div className="w-full">
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            const showDivider = !isLast || items.length === 1;

            return (
              <div
                key={item.id}
                className={`relative ${
                  showDivider
                    ? 'h-[74px] after:absolute after:bottom-0 after:left-[27px] after:right-[29px] after:h-px after:bg-gray-100'
                    : 'h-[72px]'
                }`}
              >
                <div
                  className={`grid h-[72px] ${GRID_COLUMNS} items-center text-button leading-normal text-gray-900`}
                >
                  <span className="truncate pl-[30px]">{item.name}</span>
                  <span className="truncate pl-[30px]">{ITEM_CATEGORY_LABEL[item.category]}</span>
                  <span className="flex min-w-0 items-center gap-3 pl-[30px]">
                    {item.buyer ? (
                      <>
                        <UserAvatar
                          name={item.buyer.name}
                          avatarUrl={item.buyer.avatarUrl}
                          className="size-[34px]"
                        />
                        <span className="truncate">{item.buyer.name}</span>
                      </>
                    ) : (
                      <span className="text-gray-400">미지정</span>
                    )}
                  </span>
                  <span className="truncate pl-[30px]">{formatDate(item.updatedAt, dateFormat)}</span>
                  <span className="pl-[30px]">
                    <StatusBadge variant={item.status} className="w-[68px] px-0 leading-normal" />
                  </span>
                  <span className="flex items-center justify-end pr-[25px] text-gray-400">
                    <Link
                      to={`/items/${item.id}/edit`}
                      aria-label="수정"
                      className="flex size-[39px] items-center justify-center transition-colors hover:text-gray-500"
                    >
                      <EditIcon className="size-[39px]" />
                    </Link>
                    <button
                      type="button"
                      aria-label="공유"
                      className="flex size-[39px] items-center justify-center transition-colors hover:text-gray-500"
                    >
                      <ShareIcon className="size-[39px]" />
                    </button>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  </div>
  );
};
