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

export interface ChatRoom {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: string;
  unreadCount: number;
}

/** 같은 발신자가 연속으로 보낸 메시지를 하나로 묶은 단위 */
export interface ChatMessageGroup {
  key: string;
  senderId: string;
  senderName: string;
  senderAvatarUrl?: string;
  isMine: boolean;
  timestamp: string;
  items: ChatMessage[];
}
