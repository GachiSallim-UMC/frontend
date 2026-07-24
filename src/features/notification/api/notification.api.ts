import { apiClient } from '@/shared/api';

const BASE = '/notifications';

export const notificationApi = {
  hide: async (notificationId: string): Promise<void> => {
    await apiClient.delete(`${BASE}/${notificationId}`);
  },
};
