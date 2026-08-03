import type {
  CardMessageTypeDto,
  ChatMessage,
  ChatRoom,
  ChatRoomCategory,
  ChatRoomDetailResponse,
  ChatRoomListItemResponse,
  ChatRoomMember,
  ChatShareCard,
  MessageResponse,
  MessageTypeDto,
  ShareCardType,
} from '@/features/messenger/types';
import { CARD_MESSAGE_TYPES } from '@/features/messenger/types';

/** 기존 목데이터 표기(예: '오전 10:06')와 맞춘 시각 포맷 */
export const formatTimestamp = (iso: string): string => {
  const date = new Date(iso);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const period = hours < 12 ? '오전' : '오후';
  const displayHour = hours % 12 === 0 ? 12 : hours % 12;
  return `${period} ${displayHour}:${String(minutes).padStart(2, '0')}`;
};

/** 멤버 목록에 쓰는 가입일 표기 (예: '2026.03.02') */
const formatJoinedDate = (iso: string): string => {
  const date = new Date(iso);
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
};

export const mapChatRoomType = (type: ChatRoomListItemResponse['type']): ChatRoomCategory => {
  if (type === 'NOTICE') return 'notice';
  if (type === 'DM') return 'dm';
  return 'group';
};

/** 프론트 카테고리 → 백엔드 ChatRoomType enum (방 생성 요청용) */
export const mapCategoryToChatRoomType = (category: ChatRoomCategory): 'GROUP' | 'NOTICE' | 'DM' => {
  if (category === 'notice') return 'NOTICE';
  if (category === 'dm') return 'DM';
  return 'GROUP';
};

export const isCardMessageType = (type: MessageTypeDto): type is CardMessageTypeDto =>
  (CARD_MESSAGE_TYPES as readonly string[]).includes(type);

const CARD_TYPE_LABEL: Record<CardMessageTypeDto, string> = {
  CARD_CHORE: '집안일 공유',
  CARD_EXPENSE: '생활비 공유',
  CARD_SUPPLY: '물품 공유',
  CARD_RULE: '규칙 공유',
};

const CARD_TYPE_TO_SHARE_TYPE: Record<CardMessageTypeDto, ChatShareCard['type']> = {
  CARD_CHORE: 'chore',
  CARD_EXPENSE: 'expense',
  CARD_SUPPLY: 'item',
  CARD_RULE: 'rule',
};

/** 공유 대상 도메인 → 카드 메시지 타입. useShareToMessenger/useChatRoom 양쪽에서 공용으로 씀 */
export const CARD_TYPE_BY_SHARE_TYPE: Record<ShareCardType, CardMessageTypeDto> = {
  chore: 'CARD_CHORE',
  expense: 'CARD_EXPENSE',
  item: 'CARD_SUPPLY',
  rule: 'CARD_RULE',
};

/** 카드 메시지 → ChatShareCard (타입 라벨만, 상세 내용은 pages/messenger에서 보강) */
const toShareCard = (dto: MessageResponse, cardType: CardMessageTypeDto): ChatShareCard => ({
  type: CARD_TYPE_TO_SHARE_TYPE[cardType],
  title: CARD_TYPE_LABEL[cardType],
  headline: dto.content ? ` ${dto.content}` : '',
  actionLabel: '상세 보기',
});

export interface MemberLookup {
  name: string;
  avatarUrl?: string;
}

/**
 * 메시지 응답에 아직 sender(닉네임/프로필사진)가 안 붙어있어서, 채팅방 멤버 목록에서
 * senderId로 찾아 대체한다. 그마저 없으면 senderId를 그대로 이름 자리에 표시.
 */
export const toChatMessage = (
  dto: MessageResponse,
  currentUserId: string,
  memberLookup?: Map<string, MemberLookup>,
): ChatMessage => {
  const cardType = isCardMessageType(dto.type) ? dto.type : null;
  const fallbackSender = memberLookup?.get(dto.senderId);

  return {
    id: dto.id,
    roomId: dto.chatRoomId,
    senderId: dto.senderId,
    senderName: dto.sender?.nickname ?? fallbackSender?.name ?? dto.senderId,
    senderAvatarUrl: dto.sender?.profileImage ?? fallbackSender?.avatarUrl ?? undefined,
    timestamp: formatTimestamp(dto.createdAt),
    isMine: dto.senderId === currentUserId,
    content: cardType ? undefined : dto.content || undefined,
    shareCard: cardType ? toShareCard(dto, cardType) : undefined,
    refId: cardType ? (dto.refId ?? undefined) : undefined,
  };
};

/** 방장 여부는 반드시 ownerId로 판정한다. createdBy는 최초 생성자일 뿐 위임 후에도 안 바뀜 */
export const toChatRoomMember = (dto: ChatRoomDetailResponse['members'][number], ownerId: string): ChatRoomMember => ({
  id: dto.userId,
  name: dto.user.nickname,
  avatarUrl: dto.user.profileImage ?? undefined,
  isOwner: dto.userId === ownerId,
  joinedDateLabel: formatJoinedDate(dto.joinedAt),
});

const lastMessagePreview = (message: MessageResponse | null): string => {
  if (!message) return '';
  if (isCardMessageType(message.type)) return CARD_TYPE_LABEL[message.type];
  return message.content;
};

/** 목록 응답 → 화면용 ChatRoom (멤버 상세 없음, 알림/고정은 상세 조회 전까지 기본값) */
export const toChatRoomSummary = (dto: ChatRoomListItemResponse): ChatRoom => ({
  id: dto.id,
  name: dto.name,
  lastMessage: lastMessagePreview(dto.lastMessage),
  timestamp: dto.lastMessage ? formatTimestamp(dto.lastMessage.createdAt) : '',
  unreadCount: dto.unreadCount,
  category: mapChatRoomType(dto.type),
  members: [],
  memberCount: dto.memberCount,
  notificationEnabled: true,
  isPinned: false,
});

/** 상세 응답 → 화면용 ChatRoom (멤버 전체 포함, 요청자 본인 멤버 레코드에서 알림/고정 값을 가져옴) */
export const toChatRoomDetail = (dto: ChatRoomDetailResponse, currentUserId: string): ChatRoom => {
  const myMembership = dto.members.find(member => member.userId === currentUserId);

  return {
    id: dto.id,
    name: dto.name,
    lastMessage: '',
    timestamp: '',
    unreadCount: 0,
    category: mapChatRoomType(dto.type),
    members: dto.members.map(member => toChatRoomMember(member, dto.ownerId)),
    memberCount: dto.members.length,
    notificationEnabled: myMembership?.notificationEnabled ?? true,
    isPinned: myMembership?.isPinned ?? false,
  };
};
