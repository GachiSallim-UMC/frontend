import { useCallback } from 'react';
import { Calendar } from 'lucide-react';
import { ActivityList, useActivityLog } from '@/features/activity';
import { LabelFilterDropdown } from '@/shared/components/ui';

// 모바일: Figma 활동내역 드롭다운 규격(사각형, 균등 분배). 데스크톱은 기존 규격 유지.
const MOBILE_DROPDOWN_CONTAINER_CLASS = 'flex-1 lg:flex-none';
const MOBILE_DROPDOWN_TRIGGER_CLASS = 'h-[44px] w-full rounded-[8px] px-4 font-normal lg:h-[50px] lg:w-[160px]';

export const ActivityPage = () => {
  const {
    typeFilter,
    setTypeFilter,
    typeOptions,
    memberFilter,
    setMemberFilter,
    memberOptions,
    periodFilter,
    setPeriodFilter,
    periodOptions,
    groupedLogs,
    isLoading,
    isError,
    error,
    refetch,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useActivityLog();

  const handleLoadMore = useCallback(() => {
    void fetchNextPage();
  }, [fetchNextPage]);

  return (
    <div className="flex w-full flex-1 min-h-0 bg-gray-50">
      <div className="flex h-full w-full flex-col pb-[28px]">
        <div className="flex w-full flex-1 min-h-0 flex-col py-4 lg:max-h-[720px] lg:overflow-hidden lg:rounded-[20px] lg:bg-white lg:py-[30px]">
          <div className="flex flex-wrap shrink-0 items-center gap-3 px-4 lg:px-[30px]">
            <div className="hidden lg:block">
              <LabelFilterDropdown
                value={typeFilter}
                options={typeOptions}
                onChange={setTypeFilter}
              />
            </div>
            <LabelFilterDropdown
              value={memberFilter}
              options={memberOptions}
              onChange={setMemberFilter}
              containerClassName={MOBILE_DROPDOWN_CONTAINER_CLASS}
              triggerClassName={MOBILE_DROPDOWN_TRIGGER_CLASS}
            />
            <LabelFilterDropdown
              value={periodFilter}
              options={periodOptions}
              onChange={setPeriodFilter}
              containerClassName={MOBILE_DROPDOWN_CONTAINER_CLASS}
              triggerClassName={MOBILE_DROPDOWN_TRIGGER_CLASS}
              mobileIcon={<Calendar className="size-4 shrink-0 text-gray-400" />}
            />
          </div>
          <div className="mt-5 min-h-0 flex-1 overflow-y-auto px-4 lg:px-[30px]">
            <ActivityList
              groups={groupedLogs}
              isLoading={isLoading}
              isError={isError}
              error={error}
              onRetry={() => void refetch()}
              hasNextPage={hasNextPage}
              isFetchingNextPage={isFetchingNextPage}
              onLoadMore={handleLoadMore}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
