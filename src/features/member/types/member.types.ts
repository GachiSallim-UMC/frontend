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