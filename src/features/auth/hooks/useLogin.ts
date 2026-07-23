import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useAuthStore, useGroupStore } from '@/shared/store';
import { authApi } from '../api/auth.api';
import type { LoginDto } from '../types/auth.type';
import { AUTH_QUERY_KEYS } from './auth.keys';

export const useLogin = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const setSession = useAuthStore(s => s.setSession);
  const clearSelectedGroup = useGroupStore(s => s.clearSelectedGroup);

  return useMutation({
    mutationFn: async (dto: LoginDto) => {
      const tokens = await authApi.login(dto);
      const me = await authApi.me(tokens.accessToken);
      return { tokens, me, userId: String(me.userId) };
    },
    onSuccess: ({ tokens, me, userId }) => {
      queryClient.removeQueries({ queryKey: AUTH_QUERY_KEYS.all });
      queryClient.removeQueries({ queryKey: ['member'] });
      clearSelectedGroup();
      setSession({ ...tokens, userId });
      queryClient.setQueryData(AUTH_QUERY_KEYS.me(userId), me);
      navigate('/group', { replace: true });
    },
    meta: { skipGlobalError: true },
  });
};
