import type { User } from '@/shared/types';

export interface Group {
  id: string;
  name: string;
  type: 'house' | 'school' | 'store' | 'company';
  address: string;
  inviteCode?: string;
  createdAt?: string;
  maxMemberCount?: number;
  memberCount: number;
  members: User[],
  ownerId: string;
}