import type { User } from '@/shared/types';

export interface Group {
  id: string;
  name: string;
  description: string;
  type: 'roommate' | 'share' | 'boarding' | 'family' | 'etc';
  address: string;
  inviteCode?: string;
  createdAt?: string;
  maxMemberCount?: number;
  memberCount: number;
  members: User[],
  ownerId: string;
}

export interface AddGroupDto {
    name: string;
    description: string;
    type: 'roommate' | 'share' | 'boarding' | 'family' | 'etc';
    maxMemberCount: number;
}

