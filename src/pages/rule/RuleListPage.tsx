import { Link } from 'react-router-dom';
import { Plus } from 'lucide-react';
import {
  RULE_CATEGORY_OPTIONS,
  RULE_STATUS_OPTIONS,
  RuleListRow,
  useRuleFilters,
  useRules,
} from '@/features/rule';
import { ShareItemPickerModal, useShareToMessenger } from '@/features/messenger';
import { SelectDropdown } from '@/shared/components/form';

export const RuleListPage = () => {
  const { data = [], isLoading, error, refetch } = useRules();
  const { activeType, chatRoomOptions, openShare, closeShare, handleSelectChatRoom } = useShareToMessenger('rule');
  const { categoryFilter, setCategoryFilter, statusFilter, setStatusFilter, filteredRules } =
    useRuleFilters(data);

  return (
    <section className="mx-auto mt-16 h-[472px] w-full max-w-[1114px] rounded-[20px] bg-white p-[30px] min-[1440px]:w-[calc(100%-18px)] min-[1440px]:max-w-none">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
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

      <div className="flex h-[342px] w-full flex-col overflow-hidden rounded-[10px] border border-gray-100 bg-white">
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
          <div className="min-h-0 flex-1 overflow-x-hidden overflow-y-auto [&::-webkit-scrollbar]:w-[5px]">
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
      />
    </section>
  );
};
