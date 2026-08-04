import { useCallback, useState } from 'react';
import { ActivityFilterDropdown, ActivityList, useActivityLog } from '@/features/activity';

type ActivityFilterKey = 'type' | 'member' | 'period';

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

  const [openFilter, setOpenFilter] = useState<ActivityFilterKey | null>(null);
  const handleLoadMore = useCallback(() => {
    void fetchNextPage();
  }, [fetchNextPage]);

  return (
    <div className="flex w-full flex-1 min-h-0 bg-gray-50">
      <div className="flex h-full w-full flex-col px-4 pb-[28px] pt-[28px] lg:px-0">
        <div className="flex w-full flex-1 min-h-0 flex-col overflow-hidden rounded-[20px] bg-white py-4 shadow-card lg:max-h-[720px] lg:py-[30px]">
          <div className="flex flex-wrap shrink-0 items-center gap-3 px-4 lg:px-[30px]">
            <ActivityFilterDropdown
              value={typeFilter}
              options={typeOptions}
              onChange={setTypeFilter}
              isOpen={openFilter === 'type'}
              onOpenChange={isOpen => setOpenFilter(isOpen ? 'type' : null)}
            />
            <ActivityFilterDropdown
              value={memberFilter}
              options={memberOptions}
              onChange={setMemberFilter}
              isOpen={openFilter === 'member'}
              onOpenChange={isOpen => setOpenFilter(isOpen ? 'member' : null)}
            />
            <ActivityFilterDropdown
              value={periodFilter}
              options={periodOptions}
              onChange={setPeriodFilter}
              isOpen={openFilter === 'period'}
              onOpenChange={isOpen => setOpenFilter(isOpen ? 'period' : null)}
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
