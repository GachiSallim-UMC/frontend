import { Link } from 'react-router-dom';
import { Package, PackageMinus, PackageX, Plus } from 'lucide-react';
import EditIcon from '@/assets/icons/action/edit.svg?react';
import ShareIcon from '@/assets/icons/action/share.svg?react';
import {
  ITEM_CATEGORY_LABEL,
  ITEM_CATEGORY_OPTIONS,
  ITEM_STATUS_FILTER_TABS,
  useItemFilters,
  type Item,
} from '@/features/item';
import {
  DataTable,
  FilterTabGroup,
  SearchInput,
  StatusBadge,
  SummaryCard,
  UserAvatar,
  type Column,
} from '@/shared/components/ui';
import { SelectDropdown } from '@/shared/components/form';
import { items } from '@/pages/_shared/mockData';

export const ItemListPage = () => {
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

  const columns: Column<Item>[] = [
    { key: 'name', header: '물품명' },
    { key: 'category', header: '카테고리', render: item => ITEM_CATEGORY_LABEL[item.category] },
    {
      key: 'buyer',
      header: '구매 담당',
      render: item =>
        item.buyer ? (
          <span className="flex items-center gap-2">
            <UserAvatar name={item.buyer.name} size="xs" />
            {item.buyer.name}
          </span>
        ) : (
          <span className="text-gray-400">미지정</span>
        ),
    },
    { key: 'updatedAt', header: '마지막 변경' },
    { key: 'status', header: '현재 상태', render: item => <StatusBadge variant={item.status} /> },
    {
      key: 'actions',
      header: '',
      align: 'right',
      render: item => (
        <span className="flex justify-end gap-1 text-gray-500">
          <Link to={`/items/${item.id}/edit`} aria-label="수정" className="p-2 hover:text-primary-600">
            <EditIcon className="h-5 w-5" />
          </Link>
          <button type="button" aria-label="공유" className="p-2 hover:text-primary-600">
            <ShareIcon className="h-5 w-5" />
          </button>
        </span>
      ),
    },
  ];

  return (
    <>
      <div className="mb-4 mt-7 grid grid-cols-3 gap-4">
        <SummaryCard
          icon={<Package className="h-6 w-6 text-primary-600" />}
          iconBg="bg-primary-100"
          label="전체 물품"
          value={`${items.length}종`}
          subText="등록된 공용 물품"
        />
        <SummaryCard
          icon={<PackageMinus className="h-6 w-6 text-orange-700" />}
          iconBg="bg-orange-100"
          label="부족"
          value={`${shortCount}종`}
          subText="구매 확인 필요"
        />
        <SummaryCard
          icon={<PackageX className="h-6 w-6 text-red-700" />}
          iconBg="bg-red-100"
          label="소진"
          value={`${emptyCount}종`}
          subText="즉시 구매 필요"
        />
      </div>

      <section className="rounded-[20px] bg-white p-[30px] shadow-card">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <FilterTabGroup tabs={ITEM_STATUS_FILTER_TABS} value={statusFilter} onChange={setStatusFilter} />
            <SelectDropdown
              value={categoryFilter}
              onChange={setCategoryFilter}
              options={ITEM_CATEGORY_OPTIONS}
              placeholder="전체 카테고리"
              className="w-[191px]"
            />
            <SearchInput
              className="w-[191px]"
              placeholder="물품 검색"
              value={keyword}
              onChange={e => setKeyword(e.target.value)}
            />
          </div>
          <Link
            to="/items/new"
            className="inline-flex h-[50px] items-center gap-1 rounded-lg bg-primary-600 px-4 text-button text-white transition-colors hover:bg-primary-700"
          >
            <Plus size={20} />
            물품 등록
          </Link>
        </div>

        <DataTable columns={columns} data={filteredItems} emptyMessage="등록된 공용 물품이 없습니다." />
      </section>
    </>
  );
};
