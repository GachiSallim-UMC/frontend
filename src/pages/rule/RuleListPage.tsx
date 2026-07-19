import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import {
  RULE_CATEGORY_OPTIONS,
  RULE_STATUS_OPTIONS,
  RuleListRow,
  useRuleFilters,
} from '@/features/rule';
import { SelectDropdown } from '@/shared/components/form';
import { rules } from '@/pages/_shared/mockData';

export const RuleListPage = () => {
  const { categoryFilter, setCategoryFilter, statusFilter, setStatusFilter, filteredRules } =
    useRuleFilters(rules);

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

      <div className="rounded-[10px] border border-gray-100">
        {filteredRules.length === 0 ? (
          <p className="py-16 text-center text-gray-400">등록된 생활 규칙이 없습니다.</p>
        ) : (
          filteredRules.map((rule, index) => (
            <RuleListRow key={rule.id} rule={rule} isLast={index === filteredRules.length - 1} />
          ))
        )}
      </div>
    </section>
  );
};
