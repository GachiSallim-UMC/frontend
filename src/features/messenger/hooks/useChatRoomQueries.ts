import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { messengerApi } from '@/features/messenger/api/messenger.api';
import type { MemberLookup } from '@/features/messenger/hooks/messenger.mappers';
import { toChatMessage, toChatRoomDetail, toChatRoomSummary } from '@/features/messenger/hooks/messenger.mappers';

export const MESSENGER_QUERY_KEYS = {
  all: ['messenger'] as const,
  rooms: (groupId: string | null) => [...MESSENGER_QUERY_KEYS.all, 'rooms', groupId] as const,
  roomDetail: (roomId: string | null) => [...MESSENGER_QUERY_KEYS.all, 'room-detail', roomId] as const,
  messages: (roomId: string | null) => [...MESSENGER_QUERY_KEYS.all, 'messages', roomId] as const,
};

const MESSAGE_PAGE_SIZE = 30;

/** 그룹의 채팅방 목록 */
export const useChatRooms = (groupId: string | null) => {
  const query = useQuery({
    queryKey: MESSENGER_QUERY_KEYS.rooms(groupId),
    queryFn: () => messengerApi.getChatRooms(groupId as string),
    enabled: Boolean(groupId),
    select: rooms => rooms.map(toChatRoomSummary),
  });

  return { ...query, data: query.data ?? [] };
};

/** 그룹 전체 채팅방의 안읽은 메시지 총합 (헤더 메신저 아이콘 배지용) */
export const useUnreadMessageCount = (groupId: string | null) => {
  const { data: rooms } = useChatRooms(groupId);
  return rooms.reduce((sum, room) => sum + room.unreadCount, 0);
};

/** 채팅방 상세 (선택된 방의 멤버·설정 조회용) */
export const useChatRoomDetail = (roomId: string | null, currentUserId: string) =>
  useQuery({
    queryKey: MESSENGER_QUERY_KEYS.roomDetail(roomId),
    queryFn: () => messengerApi.getChatRoomDetail(roomId as string),
    enabled: Boolean(roomId),
    select: detail => toChatRoomDetail(detail, currentUserId),
  });

/**
 * 메시지 목록 (id 커서 기반 무한 스크롤, 오래된 메시지를 더 불러오는 방향).
 * memberLookup: 메시지 응답에 sender가 없을 때 방 멤버 목록에서 이름/프로필을 대신 찾기 위한 맵.
 */
export const useChatMessages = (
  roomId: string | null,
  currentUserId: string,
  memberLookup?: Map<string, MemberLookup>,
) => {
  const query = useInfiniteQuery({
    queryKey: MESSENGER_QUERY_KEYS.messages(roomId),
    queryFn: ({ pageParam }: { pageParam?: string }) =>
      messengerApi.getMessages(roomId as string, { before: pageParam, limit: MESSAGE_PAGE_SIZE }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: lastPage =>
      lastPage.length === MESSAGE_PAGE_SIZE ? lastPage[lastPage.length - 1]?.id : undefined,
    enabled: Boolean(roomId),
  });

  // 서버는 최신순(desc)으로 페이지를 주므로, 화면 표시용으로는 오래된 메시지가 먼저 오도록 뒤집는다.
  const messages = [...(query.data?.pages.flat() ?? [])]
    .reverse()
    .map(dto => toChatMessage(dto, currentUserId, memberLookup));

  return { ...query, messages };
};
