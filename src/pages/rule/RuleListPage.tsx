import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import {
  RULE_CATEGORY_OPTIONS,
  RULE_STATUS_OPTIONS,
  RuleListRow,
  type RuleCategory,
  useRuleFilters,
  useRules,
} from '@/features/rule';
import { ShareItemPickerModal, useShareToMessenger } from '@/features/messenger';
import { SelectDropdown } from '@/shared/components/form';
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
  const { activeType, chatRoomOptions, openShare, closeShare, handleSelectChatRoom, isSharePending } =
    useShareToMessenger('rule');
  const { categoryFilter, setCategoryFilter, statusFilter, setStatusFilter, filteredRules } =
    useRuleFilters(data);

  return (
    <section className="mx-auto w-full px-4 pb-6 pt-4 lg:mt-16 lg:h-[472px] lg:max-w-[1114px] lg:rounded-[20px] lg:bg-white lg:p-[30px] min-[1440px]:w-[calc(100%-18px)] min-[1440px]:max-w-none">
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
                onShare={openShare}
              />
            ))}
          </div>
        )}
      </div>
      <ShareItemPickerModal
        type={activeType}
        options={chatRoomOptions}
        onSelect={handleSelectChatRoom}
        onClose={closeShare}
        isSubmitting={isSharePending}
      />
    </section>
  );
};
