import { apiClient } from '@/shared/api';
import type { PushSubscriptionPayload, PushSubscriptionResponse } from '../types/pushSubscription.type';

const BASE = '/notification-push-subscriptions';

export const pushSubscriptionApi = {
  subscribe: async (payload: PushSubscriptionPayload): Promise<PushSubscriptionResponse> => {
    const { data } = await apiClient.post<PushSubscriptionResponse>(BASE, payload);
    return data;
  },

  unsubscribe: async (subscriptionId: number, accessToken?: string): Promise<void> => {
    await apiClient.delete(`${BASE}/${subscriptionId}`, {
      headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined,
    });
  },
};
