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

export interface MemberGroupResponse {
  id: string;
  name: string;
  description: string | null;
  inviteCode: string | null;
  inviteExpiredAt: string;
  currentMembers: number;
  maxMembers: number;
  createdBy: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * GET /groups/:groupId/members 응답 (2026-07-26 실제 dev-api로 확인).
 * GroupMember 원본 필드만 오고 닉네임/프로필사진은 아직 없음 — 백엔드에 추가 요청해둔 상태.
 */
export interface GroupMemberResponse {
  id: string;
  userId: string;
  groupId: string;
  role: MemberRole;
  joinedAt: string;
  leftAt: string | null;
}

