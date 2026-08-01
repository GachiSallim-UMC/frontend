import { useEffect, useRef, useState } from 'react';
import type { InfiniteData, QueryClient } from '@tanstack/react-query';
import { useQueryClient } from '@tanstack/react-query';
import { ChatSocketConnection } from '@/features/messenger/api/messenger.socket';
import { MESSENGER_QUERY_KEYS } from './useChatRoomQueries';
import type { ChatRoomListItemResponse, MessageResponse } from '@/features/messenger/types';
import { useErrorStore } from '@/shared/store';

const applyIncomingMessage = (
  queryClient: QueryClient,
  groupId: string | null,
  activeRoomId: string,
  currentUserId: string,
  message: MessageResponse,
) => {
  queryClient.setQueryData<InfiniteData<MessageResponse[], string | undefined>>(
    MESSENGER_QUERY_KEYS.messages(message.chatRoomId),
    old => {
      if (!old) return old;
      const firstPage = old.pages[0] ?? [];
      if (firstPage.some(m => m.id === message.id)) return old;
      return { ...old, pages: [[message, ...firstPage], ...old.pages.slice(1)] };
    },
  );

  // 지금 보고 있는 방이거나 내가 보낸 메시지면 안읽음 카운트를 올리지 않는다.
  const shouldIncrementUnread = message.chatRoomId !== activeRoomId && message.senderId !== currentUserId;

  queryClient.setQueryData<ChatRoomListItemResponse[]>(MESSENGER_QUERY_KEYS.rooms(groupId), old =>
    old?.map(room =>
      room.id === message.chatRoomId
        ? { ...room, lastMessage: message, unreadCount: shouldIncrementUnread ? room.unreadCount + 1 : room.unreadCount }
        : room,
    ),
  );
};

/**
 * 채팅방 화면(useChatRoom)이 살아있는 동안만 웹소켓 연결을 유지한다.
 * VITE_WS_URL 미설정 시 연결 자체가 no-op이라 isConnected는 true로 유지(REST-only 기존 동작과 동일).
 */
export const useChatSocket = (groupId: string | null, activeRoomId: string, currentUserId: string) => {
  const queryClient = useQueryClient();
  const connectionRef = useRef<ChatSocketConnection | null>(null);
  const [isConnected, setIsConnected] = useState(true);

  const groupIdRef = useRef(groupId);
  groupIdRef.current = groupId;
  const activeRoomIdRef = useRef(activeRoomId);
  activeRoomIdRef.current = activeRoomId;
  const currentUserIdRef = useRef(currentUserId);
  currentUserIdRef.current = currentUserId;

  useEffect(() => {
    const connection = new ChatSocketConnection({
      onStatusChange: status => setIsConnected(status === 'open'),
      onMessageNew: data =>
        applyIncomingMessage(queryClient, groupIdRef.current, activeRoomIdRef.current, currentUserIdRef.current, data),
      onRoomJoinError: message => useErrorStore.getState().showError({ title: '알림', message }),
    });
    connectionRef.current = connection;
    connection.connect();

    return () => {
      connection.disconnect();
      connectionRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    connectionRef.current?.setActiveRoom(activeRoomId || null);
  }, [activeRoomId]);

  return { isConnected };
};
