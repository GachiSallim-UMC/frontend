export type ShareCardType = 'expense' | 'chore' | 'item' | 'rule';

export interface ChatShareCardDetail {
  /** value 없으면 한 줄 표시, 있으면 좌우 2단(라벨/값) 표시 */
  label: string;
  value?: string;
}

export interface ChatShareCard {
  type: ShareCardType;
  /** 볼드로 강조되는 제목 (예: '마트 장보기') */
  title: string;
  /** title 뒤에 이어지는 일반 문구 (예: ' 정산을 공유했어요') */
  headline: string;
  details?: ChatShareCardDetail[];
  /** 강조 버튼 라벨 (예: 정산하기 / 구매 완료 / 완료 처리 / 동의하기) */
  actionLabel: string;
}

export interface ChatMessage {
  id: string;
  roomId: string;
  senderId: string;
  senderName: string;
  senderAvatarUrl?: string;
  timestamp: string;
  isMine: boolean;
  content?: string;
  shareCard?: ChatShareCard;
  /** 카드가 참조하는 원본 도메인 항목 id (상세 보강용) */
  refId?: string;
}

export type ChatRoomCategory = 'group' | 'notice' | 'dm';

export type ChatFilter = 'all' | 'group' | 'notice' | 'unread';

export interface ChatRoomMember {
  id: string;
  name: string;
  avatarUrl?: string;
  /** 방장 여부 */
  isOwner?: boolean;
  /** 멤버 목록에 표시되는 가입/활동일 (예: '2026.03.02') */
  joinedDateLabel?: string;
}

export interface ChatRoom {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
  category: ChatRoomCategory;
  members: ChatRoomMember[];
  /** 목록 응답에서 멤버 상세 없이 인원 수만 알 때 사용 (없으면 members.length 사용) */
  memberCount?: number;
  avatarUrl?: string;
  /** 메시지 알림 on/off */
  notificationEnabled: boolean;
  /** 상단 고정 여부 */
  isPinned: boolean;
}

/** 같은 발신자가 연속으로 보낸 메시지를 하나로 묶은 단위 */
export interface ChatMessageGroup {
  key: string;
  senderId: string;
  senderName: string;
  senderAvatarUrl?: string;
  isMine: boolean;
  items: ChatMessage[];
}

/** 공유 항목 선택 모달에 표시되는, 도메인에 무관한 선택지 한 줄 */
export interface ShareableOption {
  id: string;
  title: string;
  subtitle?: string;
}

// ==================== 백엔드 응답/요청 DTO ====================
// 2026-07-26 백엔드팀이 요청한 4가지(카테고리, 멤버별 알림/고정, 방장 위임, 목록/메시지 응답
// 보강)를 모두 반영 완료. 방장은 `createdBy`(최초 생성자, 불변)와 별도로 `ownerId`(현재 방장,
// 위임 가능)로 분리되어 있으니 소유권 판정은 반드시 ownerId로 해야 한다.
// 단, 메시지 전송(POST) 응답에는 여전히 sender가 안 붙어있어(목록 조회 GET에만 포함) sender는
// optional로 유지 — 방 멤버 목록에서 대체 조회하는 fallback도 그대로 둔다.

export type ChatRoomTypeDto = 'GROUP' | 'NOTICE' | 'DM';

export const CARD_MESSAGE_TYPES = ['CARD_CHORE', 'CARD_EXPENSE', 'CARD_SUPPLY', 'CARD_RULE'] as const;
export type CardMessageTypeDto = (typeof CARD_MESSAGE_TYPES)[number];
export type MessageTypeDto = 'TEXT' | 'SYSTEM' | CardMessageTypeDto;

/** GET /chat-rooms/:roomId/messages 항목 (목록 조회에만 sender 포함, 전송 응답엔 없음) */
export interface MessageResponse {
  id: string;
  chatRoomId: string;
  senderId: string;
  type: MessageTypeDto;
  content: string;
  refId: string | null;
  createdAt: string;
  sender?: {
    id: string;
    nickname: string;
    profileImage: string | null;
  };
}

/** GET /chat-rooms 목록의 각 항목 */
export interface ChatRoomListItemResponse {
  id: string;
  groupId: string;
  name: string;
  isDefault: boolean;
  type: ChatRoomTypeDto;
  createdBy: string;
  ownerId: string;
  createdAt: string;
  lastMessage: MessageResponse | null;
  unreadCount: number;
  memberCount: number;
}

export interface ChatRoomMemberResponse {
  userId: string;
  joinedAt: string;
  lastReadAt: string | null;
  notificationEnabled: boolean;
  isPinned: boolean;
  user: {
    id: string;
    nickname: string;
    profileImage: string | null;
  };
}

/** GET /chat-rooms/:roomId */
export interface ChatRoomDetailResponse {
  id: string;
  groupId: string;
  name: string;
  isDefault: boolean;
  type: ChatRoomTypeDto;
  createdBy: string;
  ownerId: string;
  createdAt: string;
  members: ChatRoomMemberResponse[];
}

export interface CreateChatRoomRequest {
  groupId: string;
  name: string;
  type?: ChatRoomTypeDto;
}

/** PATCH /chat-rooms/:roomId/members/me */
export interface UpdateChatRoomMemberSettingsRequest {
  notificationEnabled?: boolean;
  isPinned?: boolean;
}

export interface CreateMessageRequest {
  content: string;
}

export interface CreateCardMessageRequest {
  type: CardMessageTypeDto;
  refId: string;
  content?: string;
}

export interface InviteMemberRequest {
  userIds: string[];
}

export interface ListMessagesQuery {
  before?: string;
  limit?: number;
}

/** PATCH /chat-rooms/:roomId/owner */
export interface TransferOwnerRequest {
  userId: string;
}
