import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import EditIcon from '@/assets/icons/action/edit.svg?react';
import ShareIcon from '@/assets/icons/action/share.svg?react';
import type { RuleCategory } from '@/features/rule';
import type { RuleStatus } from '@/shared/types';
import { StatusBadge } from '@/shared/components/ui';
import { SelectDropdown } from '@/shared/components/form';
import { rules } from '@/pages/_shared/mockData';

const CATEGORY_LABEL: Record<RuleCategory, string> = {
  noise: '소음',
  visitor: '방문객',
  cleanliness: '청결',
  trash: '분리수거',
  etc: '기타',
};

const CATEGORY_OPTIONS = (Object.keys(CATEGORY_LABEL) as RuleCategory[]).map(value => ({
  value,
  label: CATEGORY_LABEL[value],
}));

const STATUS_OPTIONS: { value: RuleStatus; label: string }[] = [
  { value: 'active', label: '활성' },
  { value: 'inactive', label: '비활성' },
];

export const RuleListPage = () => {
  const [categoryFilter, setCategoryFilter] = useState<RuleCategory | ''>('');
  const [statusFilter, setStatusFilter] = useState<RuleStatus | ''>('');

  const filteredRules = rules.filter(rule => {
    if (categoryFilter && rule.category !== categoryFilter) return false;
    if (statusFilter && rule.status !== statusFilter) return false;
    return true;
  });

  return (
    <section className="rounded-[20px] bg-white p-[30px] shadow-card">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <SelectDropdown
            value={categoryFilter}
            onChange={setCategoryFilter}
            options={CATEGORY_OPTIONS}
            placeholder="전체 카테고리"
            className="w-[150px]"
          />
          <SelectDropdown
            value={statusFilter}
            onChange={setStatusFilter}
            options={STATUS_OPTIONS}
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

      <div className="rounded-[10px] border border-gray-100">
        {filteredRules.length === 0 ? (
          <p className="py-16 text-center text-gray-400">등록된 생활 규칙이 없습니다.</p>
        ) : (
          filteredRules.map((rule, index) => (
            <div
              key={rule.id}
              className={`flex items-center gap-5 px-[34px] py-[23px] ${
                index !== filteredRules.length - 1 ? 'border-b border-gray-100' : ''
              }`}
            >
              <div className="flex w-[55px] shrink-0 items-center gap-5">
                <span className="h-[30px] w-px bg-gray-200" />
                <span className="text-button font-bold text-primary-700">{CATEGORY_LABEL[rule.category]}</span>
              </div>

              <Link to={`/rules/${rule.id}`} className="min-w-0 flex-1">
                <p className="truncate text-button font-bold text-gray-900">{rule.title}</p>
                <p className="mt-1 truncate text-caption text-gray-600">
                  등록: {rule.registeredBy.name} | {rule.registeredAt} | 동의: {rule.agreement.agreedCount}/
                  {rule.agreement.totalCount}
                </p>
              </Link>

              <StatusBadge variant={rule.status} />

              <span className="flex items-center gap-1 text-gray-500">
                <Link to={`/rules/${rule.id}`} aria-label="수정" className="p-2 hover:text-primary-600">
                  <EditIcon className="h-5 w-5" />
                </Link>
                <button type="button" aria-label="공유" className="p-2 hover:text-primary-600">
                  <ShareIcon className="h-5 w-5" />
                </button>
              </span>
            </div>
          ))
        )}
      </div>
    </section>
  );
};
