import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import {
  RULE_CATEGORY_OPTIONS,
  RULE_STATUS_OPTIONS,
  RuleListRow,
  type RuleCategory,
  useRuleFilters,
  useRules,
  useShareRule,
} from '@/features/rule';
import { FilterDropdown } from '@/shared/components/ui';
import { cn } from '@/shared/lib/cn';

const MOBILE_CATEGORY_FILTERS: ReadonlyArray<{
  value: RuleCategory | '';
  label: string;
}> = [
  { value: '', label: '전체' },
  ...RULE_CATEGORY_OPTIONS,
];

export const RuleListPage = () => {
  const { data = [], isLoading, error, refetch } = useRules();
  const shareRule = useShareRule();
  const { categoryFilter, setCategoryFilter, statusFilter, setStatusFilter, filteredRules } =
    useRuleFilters(data);

  const handleShare = (id: string) => {
    if (shareRule.isPending) return;
    shareRule.mutate(id);
  };

  return (
    <section className="w-full px-4 pb-6 pt-4 lg:mt-[28px] lg:h-[472px] lg:rounded-[20px] lg:bg-white lg:p-[30px]">
      <div className="mb-4 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:hidden">
        <div className="flex w-max gap-2">
          {MOBILE_CATEGORY_FILTERS.map(option => (
            <button
              key={option.value || 'all'}
              type="button"
              onClick={() => setCategoryFilter(option.value)}
              className={cn(
                'h-8 shrink-0 rounded-full border px-4 text-mobile-label font-bold transition-colors',
                categoryFilter === option.value
                  ? 'border-primary-400 bg-primary-50 text-primary-400'
                  : 'border-gray-100 bg-white text-gray-600',
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-5 hidden flex-wrap items-center justify-between gap-3 lg:flex">
        <div className="flex flex-wrap items-center gap-3">
          <FilterDropdown
            defaultLabel="전체 카테고리"
            value={categoryFilter || 'ALL'}
            options={RULE_CATEGORY_OPTIONS}
            onChange={value => setCategoryFilter(value === 'ALL' ? '' : (value as RuleCategory))}
          />
          <FilterDropdown
            defaultLabel="전체 상태"
            value={statusFilter || 'ALL'}
            options={RULE_STATUS_OPTIONS}
            onChange={value => setStatusFilter(value === 'ALL' ? '' : (value as typeof statusFilter))}
          />
        </div>
        <Link
          to="/rules/new"
          className="inline-flex h-[50px] w-[152px] items-center justify-center gap-1 rounded-lg bg-primary-600 text-button text-white transition-colors hover:bg-primary-700"
        >
          <Plus size={24} />
          규칙 등록
        </Link>
      </div>

      <div
        className={cn(
          'flex w-full flex-col overflow-hidden rounded-lg bg-white lg:h-[342px] lg:min-h-0 lg:rounded-[10px] lg:border lg:border-gray-100',
          (isLoading || error || filteredRules.length === 0) && 'min-h-[246px]',
        )}
      >
        {isLoading ? (
          <p className="flex h-full items-center justify-center text-gray-500">
            생활규칙을 불러오는 중입니다.
          </p>
        ) : error ? (
          <div className="flex h-full flex-col items-center justify-center gap-3 text-gray-500">
            <p>{error instanceof Error ? error.message : '생활규칙을 불러오지 못했습니다.'}</p>
            <button
              type="button"
              className="text-button font-bold text-primary-600"
              onClick={() => void refetch()}
            >
              다시 시도
            </button>
          </div>
        ) : filteredRules.length === 0 ? (
          <p className="flex h-full items-center justify-center text-gray-400">
            등록된 생활 규칙이 없습니다.
          </p>
        ) : (
          <div className="overflow-x-hidden lg:min-h-0 lg:flex-1 lg:overflow-y-auto lg:[&::-webkit-scrollbar]:w-[5px]">
            {filteredRules.map((rule, index) => (
              <RuleListRow
                key={rule.id}
                rule={rule}
                isLast={index === filteredRules.length - 1}
                onShare={handleShare}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
