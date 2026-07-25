export type ShareCardType = 'expense' | 'chore' | 'item' | 'rule';

export interface ChatShareCardDetail {
  label: string;
  value: string;
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
