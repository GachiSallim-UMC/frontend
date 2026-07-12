import { Link } from 'react-router-dom';
import { Plus, PackageCheck, PackageMinus, PackageX } from 'lucide-react';
import type { Item, ItemCategory } from '@/features/item';
import { DataTable, SearchInput, StatusBadge, SummaryCard, UserAvatar, type Column } from '@/shared/components/ui';
import { PageHeading, Panel } from '@/shared/components/layout';
import { items } from '@/pages/_shared/mockData';

const CATEGORY_LABEL: Record<ItemCategory, string> = {
  kitchen: '주방',
  bathroom: '욕실',
  cleaning: '청소',
  etc: '기타',
};

const columns: Column<Item>[] = [
  { key: 'name', header: '물품명' },
  { key: 'category', header: '카테고리', render: item => CATEGORY_LABEL[item.category] },
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
        <span className="text-gray-400">미정</span>
      ),
  },
  { key: 'updatedAt', header: '최근 변경' },
  { key: 'status', header: '상태', render: item => <StatusBadge variant={item.status} /> },
];

const countByStatus = (status: Item['status']) => items.filter(item => item.status === status).length;

export const ItemListPage = () => (
  <>
    <PageHeading
      title="공용 물품"
      description="부족하거나 소진된 물품을 빠르게 확인하고 구매 담당자를 정합니다."
      actions={
        <Link
          to="/items/new"
          className="inline-flex h-[50px] items-center gap-2 rounded-lg bg-primary-600 px-4 text-button font-medium text-white transition-colors hover:bg-primary-700"
        >
          <Plus size={16} />
          물품 등록
        </Link>
      }
    />

    <div className="mb-6 grid grid-cols-3 gap-4">
      <SummaryCard
        icon={<PackageCheck className="h-6 w-6 text-green-700" />}
        iconBg="bg-green-100"
        label="충분"
        value={`${countByStatus('enough')}개`}
      />
      <SummaryCard
        icon={<PackageMinus className="h-6 w-6 text-orange-700" />}
        iconBg="bg-orange-100"
        label="부족"
        value={`${countByStatus('short')}개`}
      />
      <SummaryCard
        icon={<PackageX className="h-6 w-6 text-red-700" />}
        iconBg="bg-red-100"
        label="소진"
        value={`${countByStatus('empty')}개`}
      />
    </div>

    <Panel>
      <div className="mb-4 flex justify-end">
        <SearchInput className="w-[280px]" placeholder="물품 검색" />
      </div>
      <DataTable columns={columns} data={items} emptyMessage="등록된 공용 물품이 없습니다." />
    </Panel>
  </>
);
