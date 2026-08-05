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
import { FilterDropdown, FilterTabGroup, SearchInput, SummaryCard } from '@/shared/components/ui';
import { useGroupStore } from '@/shared/store';

const MOBILE_ITEM_STATUS_FILTER_TABS = ITEM_STATUS_FILTER_TABS.map(tab =>
  tab.value === 'all' ? { ...tab, label: '전체' } : tab,
);

export const ItemListPage = () => {
  const { data = [], isLoading, error, refetch } = useItems();
  const groupId = useGroupStore(state => state.selectedGroupId);
  const { data: groupMembers } = useGroupMembers(groupId);
  const items = data.map(item => {
    if (!item.buyer) return item;

    const member = groupMembers.find(entry => entry.userId === item.buyer?.id);
    if (!member) return item;

    return {
      ...item,
      buyer: {
        ...item.buyer,
        name: member.user.nickname || member.user.name,
        nickname: member.user.nickname,
        avatarUrl: member.user.profileImage ?? undefined,
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
    <div className="w-full pb-6 lg:pb-0">
      <div className="mb-4 grid grid-cols-2 gap-2 lg:mb-[30px] lg:grid-cols-3 lg:gap-[17px]">
        <SummaryCard
          icon={<AllItemsIcon className="size-10 min-[1200px]:size-12" />}
          iconBg="bg-green-100"
          iconClassName="size-[60px] min-[1200px]:size-[77px]"
          label="전체 물품"
          value={`${items.length}종`}
          subText="등록된 공용 물품"
          className="hidden h-[147px] px-6 py-0 shadow-none lg:flex lg:gap-3 lg:px-4 min-[1200px]:gap-4 min-[1200px]:px-6"
          labelClassName="leading-[19px] tracking-[0.62px] text-gray-600"
          valueClassName="leading-[37px]"
          subTextClassName="mt-0.5 whitespace-nowrap leading-[19px]"
        />
        <SummaryCard
          icon={<ShortItemIcon className="size-8 lg:size-10 min-[1200px]:size-12" />}
          iconBg="bg-mint-100 lg:bg-green-100"
          iconClassName="size-[50px] lg:size-[60px] min-[1200px]:size-[77px]"
          label="부족"
          value={`${shortCount}종`}
          subText="구매 확인 필요"
          className="h-20 gap-2 rounded-lg px-2 py-0 shadow-none lg:h-[147px] lg:gap-3 lg:rounded-[18px] lg:px-4 min-[1200px]:gap-4 min-[1200px]:px-6"
          labelClassName="text-mobile-caption leading-normal tracking-normal text-gray-600 lg:text-caption lg:leading-[19px] lg:tracking-[0.62px]"
          valueClassName="mt-0 text-button leading-normal lg:mt-0.5 lg:text-key-number lg:leading-[37px]"
          subTextClassName="mt-0 whitespace-nowrap text-mobile-caption leading-normal lg:mt-0.5 lg:text-caption lg:leading-[19px]"
        />
        <SummaryCard
          icon={<EmptyItemIcon className="size-8 lg:size-10 min-[1200px]:size-12" />}
          iconBg="bg-mint-100 lg:bg-green-100"
          iconClassName="size-[50px] lg:size-[60px] min-[1200px]:size-[77px]"
          label="소진"
          value={`${emptyCount}종`}
          subText="즉시 구매 필요"
          className="h-20 gap-2 rounded-lg px-2 py-0 shadow-none lg:h-[147px] lg:gap-3 lg:rounded-[18px] lg:px-4 min-[1200px]:gap-4 min-[1200px]:px-6"
          labelClassName="text-mobile-caption leading-normal tracking-normal text-gray-600 lg:text-caption lg:leading-[19px] lg:tracking-[0.62px]"
          valueClassName="mt-0 text-button leading-normal lg:mt-0.5 lg:text-key-number lg:leading-[37px]"
          subTextClassName="mt-0 whitespace-nowrap text-mobile-caption leading-normal lg:mt-0.5 lg:text-caption lg:leading-[19px]"
        />
      </div>

      <section className="bg-transparent lg:min-h-[558px] lg:rounded-[20px] lg:bg-white lg:p-[30px] min-[1200px]:h-[558px]">
        {/* lg에서는 2줄(상태 탭 / 카테고리·검색·등록)로 배치. 첫 칸은 드롭다운 폭에
            맞춰 auto로 두어야 검색창이 남는 공간을 채웁니다. */}
        <div className="mb-4 flex items-center lg:mb-5 lg:grid lg:grid-cols-[auto_minmax(0,1fr)_152px] lg:gap-3 min-[1200px]:flex min-[1200px]:flex-nowrap min-[1200px]:justify-between">
          <FilterTabGroup
            tabs={MOBILE_ITEM_STATUS_FILTER_TABS}
            value={statusFilter}
            onChange={setStatusFilter}
            className="gap-1 [&>button]:h-8 [&>button]:rounded-full [&>button]:px-4 [&>button]:text-mobile-label [&>button]:font-bold lg:hidden"
            activeClassName="border-primary-400 text-primary-400"
          />
          <div className="flex min-w-0 flex-wrap items-center gap-3 lg:contents min-[1200px]:flex min-[1200px]:flex-nowrap">
            <FilterTabGroup
              tabs={ITEM_STATUS_FILTER_TABS}
              value={statusFilter}
              onChange={setStatusFilter}
              className="hidden gap-3 lg:col-span-3 lg:flex lg:w-fit [&>button]:justify-center [&>button]:px-0 [&>button:first-child]:w-[148px] [&>button:not(:first-child)]:w-[106px]"
            />
            <div className="hidden lg:flex">
              <FilterDropdown
                defaultLabel="전체 카테고리"
                value={categoryFilter || 'ALL'}
                options={ITEM_CATEGORY_OPTIONS}
                onChange={value => setCategoryFilter(value === 'ALL' ? '' : (value as typeof categoryFilter))}
              />
            </div>
            <SearchInput
              className="hidden w-full lg:flex min-[1200px]:w-[clamp(165px,calc(16.25vw-43px),191px)]"
              placeholder="물품 검색"
              value={keyword}
              onChange={e => setKeyword(e.target.value)}
            />
          </div>
          <Link
            to="/items/new"
            className="hidden h-[50px] w-[152px] shrink-0 items-center justify-center gap-1 rounded-lg bg-primary-600 text-button text-white transition-colors hover:bg-primary-700 lg:inline-flex"
          >
            <Plus size={24} />
            물품 등록
          </Link>
        </div>

        {isLoading ? (
          <p className="flex min-h-[120px] items-center justify-center text-mobile-label text-gray-500 lg:h-[428px] lg:text-button">
            공용물품을 불러오는 중입니다.
          </p>
        ) : error ? (
          <div className="flex min-h-[120px] flex-col items-center justify-center gap-3 text-mobile-label text-gray-500 lg:h-[428px] lg:text-button">
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
