import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useAuthStore, useGroupStore } from '@/shared/store';
import { authApi } from '@/features/auth/api/auth.api';

export const useLogout = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const clearSession = useAuthStore(s => s.clearSession);
  const clearSelectedGroup = useGroupStore(s => s.clearSelectedGroup);

  return useMutation({
    mutationFn: authApi.logout,
    onSettled: () => {
      clearSession();
      clearSelectedGroup();
      queryClient.clear();
      navigate('/login', { replace: true });
    },
    meta: { skipGlobalError: true },
  });
};
