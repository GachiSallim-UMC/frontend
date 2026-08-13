import { useQuery } from '@tanstack/react-query';
import { authApi } from '@/features/auth/api/auth.api';
import { useAuthStore } from '@/shared/store';
import { AUTH_QUERY_KEYS } from '@/features/auth/hooks/auth.keys';

export const useMe = () => {
  const userId = useAuthStore(s => s.userId);
  const accessToken = useAuthStore(s => s.accessToken);

  return useQuery({
    queryKey: AUTH_QUERY_KEYS.me(userId),
    queryFn: () => authApi.me(),
    enabled: Boolean(accessToken && userId),
  });
};
