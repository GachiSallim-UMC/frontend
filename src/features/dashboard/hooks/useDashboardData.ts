import { useQuery } from '@tanstack/react-query';
import { SHARED_QUERY_ROOTS } from '@/shared/lib';
import { dashboardApi } from '@/features/dashboard/api/dashboard.api';

export const useDashboardData = (groupId: number) => {
  return useQuery({
    queryKey: [...SHARED_QUERY_ROOTS.dashboard, groupId],
    queryFn: () => dashboardApi.getDashboard(groupId),
    enabled: !!groupId,
    staleTime: 0,
    refetchOnMount: 'always',
  });
};
