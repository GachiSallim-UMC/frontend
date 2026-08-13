import type { User } from '@/shared/types';

export type MemberRole = 'ADMIN' | 'MEMBER';

export type ResidenceType = 'ROOMMATE' | 'SHARE' | 'BOARDING' | 'FAMILY' | 'ETC';

export interface Member {
  id: string;
  userId: string;
  name: string;
  role: MemberRole;
  joinedAt?: string;
  avatarUrl?: string;
  avatarId?: number;
}

/** GET /groups/:groupId/members 응답 (닉네임/프로필사진 포함) */
export interface GroupMemberResponse {
  userId: string;
  groupId: string;
  role: MemberRole;
  joinedAt: string;
  leftAt: string | null;
  user: {
    id: string;
    name: string;
    nickname: string;
    profileImage: string | null;
  };
}

/** 그룹 멤버 관계 응답 */
export interface GroupMemberRelationResponse {
  id: string;
  userId: string;
  groupId: string;
  role: MemberRole;
  joinedAt: string;
  leftAt: string | null;
}

/**그릅 전체의 기능 */
export type PermissionType =
  | 'allowChoreRegistration'
  | 'allowItemStatusChange'
  | 'allowSettlementRegistration'
  | 'autoApproveNewMembers';

export interface Group {
  id: string;
  name: string;
  description: string;
  type: ResidenceType | '';
  address: string;
  inviteCode?: string;
  createdAt?: string;
  maxMemberCount?: number;
  memberCount: number;
  members: User[];
  ownerId: string;
  groupImage?: string | null;
}

export interface AddGroupDto {
  name: string;
  description: string;
  type: ResidenceType | '';
  maxMemberCount: number;
}

/** 그룹 정보 응답*/
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
  groupImage?: string | null;
  residenceType?: ResidenceType;
}

/**그룹 생성 */
export interface CreateGroupDto {
  name: string;
  description?: string | null;
  maxMembers?: number;
  permissions?: PermissionType[];
  groupImage?: string | null;
  residenceType?: ResidenceType;
}

/**초대 코드로 그룹 참여*/
export interface JoinGroupDto {
  inviteCode: string;
}

/**그룹 정보 수정 */
export type UpdateGroupDto = CreateGroupDto;

/**구성원 역할 변경 */
export interface UpdateMemberRoleDto {
  role: string;
}

// 그룹 권한 조회 응답 타입
export interface GroupPermissionsResponse {
  groupId: number;
  allowChoreRegistration: boolean;
  allowSettlementRegistration: boolean;
  allowItemStatusChange: boolean;
  autoApproveNewMembers: boolean;
  updatedAt: string;
}

// 그룹 권한 수정 요청 타입
export type UpdateGroupPermissionsDto = Partial<
  Omit<GroupPermissionsResponse, 'groupId' | 'updatedAt'>
>;

/**초대 코드 미리보기 응답 */
export interface InviteInfoResponse {
  name: string;
  description: string;
  currentMembers: number;
  maxMembers: number;
  residenceType?: ResidenceType;
  groupImage?: string | null;
}
