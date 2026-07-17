import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import EditIcon from '@/assets/icons/action/edit.svg?react';
import ShareIcon from '@/assets/icons/action/share.svg?react';
import {
  RULE_CATEGORY_LABEL,
  RULE_CATEGORY_OPTIONS,
  RULE_STATUS_OPTIONS,
  useRuleFilters,
  type Rule,
} from '@/features/rule';
import { DataTable, StatusBadge, type Column } from '@/shared/components/ui';
import { SelectDropdown } from '@/shared/components/form';
import { rules } from '@/pages/_shared/mockData';

export const RuleListPage = () => {
  const { categoryFilter, setCategoryFilter, statusFilter, setStatusFilter, filteredRules } =
    useRuleFilters(rules);

  const columns: Column<Rule>[] = [
    {
      key: 'category',
      header: '카테고리',
      render: rule => (
        <span className="whitespace-nowrap font-bold text-primary-700">
          {RULE_CATEGORY_LABEL[rule.category]}
        </span>
      ),
    },
    {
      key: 'title',
      header: '규칙',
      render: rule => (
        <Link to={`/rules/${rule.id}`} className="block min-w-0">
          <p className="truncate font-bold text-gray-900">{rule.title}</p>
          <p className="mt-1 truncate text-caption text-gray-600">
            등록: {rule.registeredBy.name} | {rule.registeredAt} | 동의:{' '}
            {rule.agreement.agreedCount}/{rule.agreement.totalCount}
          </p>
        </Link>
      ),
    },
    { key: 'status', header: '상태', render: rule => <StatusBadge variant={rule.status} /> },
    {
      key: 'actions',
      header: '',
      align: 'right',
      render: rule => (
        <span className="flex justify-end gap-1 text-gray-500">
          <Link
            to={`/rules/${rule.id}`}
            aria-label="수정"
            className="p-2 hover:text-primary-600"
          >
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
    <section className="mt-7 rounded-[20px] bg-white p-[30px] shadow-card">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <SelectDropdown
            value={categoryFilter}
            onChange={setCategoryFilter}
            options={RULE_CATEGORY_OPTIONS}
            placeholder="전체 카테고리"
            className="w-[150px]"
          />
          <SelectDropdown
            value={statusFilter}
            onChange={setStatusFilter}
            options={RULE_STATUS_OPTIONS}
            placeholder="전체 상태"
            className="w-[150px]"
          />
        </div>
        <Link
          to="/rules/new"
          className="inline-flex h-[50px] items-center gap-1 rounded-lg bg-primary-600 px-4 text-button text-white transition-colors hover:bg-primary-700"
        >
          <Plus size={20} />
          규칙 등록
        </Link>
      </div>

      <DataTable columns={columns} data={filteredRules} emptyMessage="등록된 생활 규칙이 없습니다." />
    </section>
  );
};
