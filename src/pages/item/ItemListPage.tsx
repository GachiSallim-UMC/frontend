import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import AllItemsIcon from '@/assets/icons/item/all-items.svg?react';
import ShortItemIcon from '@/assets/icons/item/short.svg?react';
import EmptyItemIcon from '@/assets/icons/item/empty.svg?react';
import {
  ITEM_CATEGORY_OPTIONS,
  ITEM_STATUS_FILTER_TABS,
  ItemTable,
  useItemFilters,
  useItems,
} from '@/features/item';
import { useGroupMembers } from '@/features/member';
import { SelectDropdown } from '@/shared/components/form';
import { FilterTabGroup, SearchInput, SummaryCard } from '@/shared/components/ui';

export const ItemListPage = () => {
  const { data = [], isLoading, error, refetch } = useItems();
  const { data: groupMembers } = useGroupMembers();
  const items = data.map(item => {
    if (!item.buyer) return item;

    const member = groupMembers.find(entry => entry.userId === item.buyer?.id);
    if (!member) return item;

    return {
      ...item,
      buyer: {
        ...item.buyer,
        name: member.name,
        nickname: member.nickname,
        avatarUrl: member.profileImage ?? undefined,
      },
    };
  });
  const {
    statusFilter,
    setStatusFilter,
    categoryFilter,
    setCategoryFilter,
    keyword,
    setKeyword,
    filteredItems,
    shortCount,
    emptyCount,
  } = useItemFilters(items);

  return (
    <div className="mx-auto mt-16 w-full max-w-[1114px] min-[1440px]:w-[calc(100%-18px)] min-[1440px]:max-w-none">
      <div className="mb-[30px] grid grid-cols-3 gap-[17px]">
        <SummaryCard
          icon={<AllItemsIcon className="h-12 w-12" />}
          iconBg="bg-green-100"
          iconClassName="size-[77px]"
          label="전체 물품"
          value={`${items.length}종`}
          subText="등록된 공용 물품"
          className="h-[147px] px-6 py-0 shadow-none"
          labelClassName="leading-[19px] tracking-[0.62px] text-gray-600"
          valueClassName="leading-[37px]"
          subTextClassName="mt-0.5 leading-[19px]"
        />
        <SummaryCard
          icon={<ShortItemIcon className="h-12 w-12" />}
          iconBg="bg-green-100"
          iconClassName="size-[77px]"
          label="부족"
          value={`${shortCount}종`}
          subText="구매 확인 필요"
          className="h-[147px] px-6 py-0 shadow-none"
          labelClassName="leading-[19px] tracking-[0.62px] text-gray-600"
          valueClassName="leading-[37px]"
          subTextClassName="mt-0.5 leading-[19px]"
        />
        <SummaryCard
          icon={<EmptyItemIcon className="h-12 w-12" />}
          iconBg="bg-green-100"
          iconClassName="size-[77px]"
          label="소진"
          value={`${emptyCount}종`}
          subText="즉시 구매 필요"
          className="h-[147px] px-6 py-0 shadow-none"
          labelClassName="leading-[19px] tracking-[0.62px] text-gray-600"
          valueClassName="leading-[37px]"
          subTextClassName="mt-0.5 leading-[19px]"
        />
      </div>

      <section className="h-[558px] rounded-[20px] bg-white p-[30px]">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 min-[1200px]:flex-nowrap">
          <div className="flex min-w-0 flex-wrap items-center gap-3 min-[1200px]:flex-nowrap">
            <FilterTabGroup
              tabs={ITEM_STATUS_FILTER_TABS}
              value={statusFilter}
              onChange={setStatusFilter}
              className="gap-3 [&>button]:justify-center [&>button]:px-0 [&>button:first-child]:w-[148px] [&>button:not(:first-child)]:w-[106px]"
            />
            <SelectDropdown
              value={categoryFilter}
              onChange={setCategoryFilter}
              options={ITEM_CATEGORY_OPTIONS}
              placeholder="전체 카테고리"
              className="w-[clamp(165px,calc(16.25vw-43px),191px)]"
            />
            <SearchInput
              className="w-[clamp(165px,calc(16.25vw-43px),191px)]"
              placeholder="물품 검색"
              value={keyword}
              onChange={e => setKeyword(e.target.value)}
            />
          </div>
          <Link
            to="/items/new"
            className="inline-flex h-[50px] w-[152px] shrink-0 items-center justify-center gap-1 rounded-lg bg-primary-600 text-button text-white transition-colors hover:bg-primary-700"
          >
            <Plus size={24} />
            물품 등록
          </Link>
        </div>

        {isLoading ? (
          <p className="flex h-[428px] items-center justify-center text-gray-500">
            공용물품을 불러오는 중입니다.
          </p>
        ) : error ? (
          <div className="flex h-[428px] flex-col items-center justify-center gap-3 text-gray-500">
            <p>{error instanceof Error ? error.message : '공용물품을 불러오지 못했습니다.'}</p>
            <button
              type="button"
              className="text-button font-bold text-primary-600"
              onClick={() => void refetch()}
            >
              다시 시도
            </button>
          </div>
        ) : (
          <ItemTable items={filteredItems} />
        )}
      </section>
    </div>
  );
};
