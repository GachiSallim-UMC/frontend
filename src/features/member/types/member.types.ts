export type MemberRole = 'ADMIN' | 'MEMBER';

export interface Member {
    id: string;
    name: string;
    role: MemberRole;
    joinedAt?: string;
    avatarUrl?: string;
    avatarId?: number;
}

export type PermissionType =
  | 'ALLOW_CHORE'
  | 'ALLOW_SETTLEMENT'
  | 'ALLOW_ITEM_STATUS'
  | 'AUTO_APPROVE';
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

