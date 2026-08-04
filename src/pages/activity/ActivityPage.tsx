import { useCallback } from 'react';
import { ActivityList, useActivityLog } from '@/features/activity';
import { LabelFilterDropdown } from '@/shared/components/ui';

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
        <div className="flex w-full flex-1 min-h-0 flex-col overflow-hidden rounded-[20px] bg-white py-4 lg:max-h-[720px] lg:py-[30px]">
          <div className="flex flex-wrap shrink-0 items-center gap-3 px-4 lg:px-[30px]">
            <LabelFilterDropdown
              value={typeFilter}
              options={typeOptions}
              onChange={setTypeFilter}
            />
            <LabelFilterDropdown
              value={memberFilter}
              options={memberOptions}
              onChange={setMemberFilter}
            />
            <LabelFilterDropdown
              value={periodFilter}
              options={periodOptions}
              onChange={setPeriodFilter}
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
