import { useEffect, useRef } from 'react';
import type { FC } from 'react';
import type { ActivityLogGroup } from '@/features/activity/types';
import { ActivityDateGroup } from '@/features/activity/components/ActivityDateGroup';
import { ApiError } from '@/shared/api';
import { Button } from '@/shared/components';

interface ActivityListProps {
  groups: ActivityLogGroup[];
  isLoading: boolean;
  isError: boolean;
  error: unknown;
  onRetry: () => void;
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  onLoadMore: () => void;
}

export const ActivityList: FC<ActivityListProps> = ({
  groups,
  isLoading,
  isError,
  error,
  onRetry,
  hasNextPage,
  isFetchingNextPage,
  onLoadMore,
}) => {
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const target = sentinelRef.current;
    if (!target || !hasNextPage) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) onLoadMore();
    });
    observer.observe(target);
    return () => observer.disconnect();
  }, [hasNextPage, onLoadMore]);

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <span className="h-6 w-6 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />
        <span className="ml-3 text-caption text-gray-600">활동 내역을 불러오는 중입니다</span>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-3 rounded-lg border border-red-300 bg-red-100 px-4 text-center">
        <p className="text-caption font-medium text-red-700">
          {error instanceof ApiError ? error.message : '활동 내역을 불러오지 못했습니다.'}
        </p>
        <Button type="button" variant="outline" size="sm" onClick={onRetry}>
          다시 시도
        </Button>
      </div>
    );
  }

  if (groups.length === 0) {
    return (
      <div className="flex h-full w-full items-center justify-center text-caption text-gray-500">
        해당 조건에 맞는 활동 내역이 없습니다.
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col">
      {groups.map(group => (
        <ActivityDateGroup key={group.date} dateLabel={group.dateLabel} logs={group.logs} />
      ))}
      {hasNextPage && (
        <div ref={sentinelRef} className="flex w-full items-center justify-center py-4">
          {isFetchingNextPage && (
            <span className="h-5 w-5 animate-spin rounded-full border-2 border-primary-500 border-t-transparent" />
          )}
        </div>
      )}
    </div>
  );
};
