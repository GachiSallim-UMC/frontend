import { useQuery } from '@tanstack/react-query';
import { dashboardApi } from '../api/dashboard.api';

export const useDashboardData = (groupId: number) => {
  return useQuery({
    queryKey: ['dashboard', groupId],
    queryFn: () => dashboardApi.getDashboard(groupId),
    enabled: !!groupId,
  });
};