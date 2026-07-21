import { useEffect, useMemo, useState } from 'react';
import type {
  ChatMessage,
  ChatMessageGroup,
  ChatRoom,
  ChatShareCard,
  ShareCardType,
} from '@/features/messenger/types';

const groupMessagesBySender = (messages: ChatMessage[]): ChatMessageGroup[] => {
  const groups: ChatMessageGroup[] = [];
  messages.forEach(message => {
    const lastGroup = groups[groups.length - 1];
    if (lastGroup && lastGroup.senderId === message.senderId) {
      lastGroup.items.push(message);
      lastGroup.timestamp = message.timestamp;
    } else {
      groups.push({
        key: message.id,
        senderId: message.senderId,
        senderName: message.senderName,
        senderAvatarUrl: message.senderAvatarUrl,
        isMine: message.isMine,
        timestamp: message.timestamp,
        items: [message],
      });
    }
  });
  return groups;
};

export const useChatRoom = (
  initialRooms: ChatRoom[],
  initialMessages: ChatMessage[],
  currentUserId: string,
  currentUserName: string,
) => {
  const [rooms, setRooms] = useState(initialRooms);
  const [activeRoomId, setActiveRoomId] = useState(initialRooms[0]?.id ?? '');
  const [messages, setMessages] = useState(initialMessages);
  const [draft, setDraft] = useState('');
  const [activeShareType, setActiveShareType] = useState<ShareCardType | null>(null);

  const activeRoom = rooms.find(room => room.id === activeRoomId) ?? rooms[0];

  // 채팅방을 열람 중이면 안읽음 배지를 지운다 (최초 진입한 방 포함)
  useEffect(() => {
    setRooms(prev => prev.map(room => (room.id === activeRoomId ? { ...room, unreadCount: 0 } : room)));
  }, [activeRoomId]);

  const messageGroups = useMemo(() => {
    const roomMessages = messages.filter(message => message.roomId === activeRoomId);
    return groupMessagesBySender(roomMessages);
  }, [messages, activeRoomId]);

  const selectRoom = (roomId: string) => {
    setActiveRoomId(roomId);
    setDraft('');
  };

  const sendMessage = () => {
    const content = draft.trim();
    if (!content || !activeRoom) return;

    setMessages(prev => [
      ...prev,
      {
        id: `local-${Date.now()}`,
        roomId: activeRoom.id,
        senderId: currentUserId,
        senderName: currentUserName,
        timestamp: '방금',
        isMine: true,
        content,
      },
    ]);
    setDraft('');
  };

  const shareItem = (shareCard: ChatShareCard) => {
    if (!activeRoom) return;

    setMessages(prev => [
      ...prev,
      {
        id: `local-${Date.now()}`,
        roomId: activeRoom.id,
        senderId: currentUserId,
        senderName: currentUserName,
        timestamp: '방금',
        isMine: true,
        shareCard,
      },
    ]);
    setActiveShareType(null);
  };

  return {
    rooms,
    activeRoom,
    activeRoomId,
    setActiveRoomId: selectRoom,
    messageGroups,
    draft,
    setDraft,
    sendMessage,
    activeShareType,
    openSharePicker: setActiveShareType,
    closeSharePicker: () => setActiveShareType(null),
    shareItem,
  };
};
