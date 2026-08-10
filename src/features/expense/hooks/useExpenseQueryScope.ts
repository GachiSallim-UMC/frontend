import { useAuthStore, useGroupStore } from '@/shared/store';

export const useExpenseQueryScope = () => {
  const userId = useAuthStore(state => state.userId);
  const groupId = useGroupStore(state => state.selectedGroupId);

  return { userId, groupId };
};
