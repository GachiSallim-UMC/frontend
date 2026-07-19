import { useMemo, useState } from 'react';
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
  currentUserName: string,
) => {
  const [activeRoomId, setActiveRoomId] = useState(initialRooms[0]?.id ?? '');
  const [messages, setMessages] = useState(initialMessages);
  const [draft, setDraft] = useState('');
  const [activeShareType, setActiveShareType] = useState<ShareCardType | null>(null);

  const activeRoom = initialRooms.find(room => room.id === activeRoomId) ?? initialRooms[0];

  const messageGroups = useMemo(() => {
    const roomMessages = messages.filter(message => message.roomId === activeRoomId);
    return groupMessagesBySender(roomMessages);
  }, [messages, activeRoomId]);

  const sendMessage = () => {
    const content = draft.trim();
    if (!content || !activeRoom) return;

    setMessages(prev => [
      ...prev,
      {
        id: `local-${Date.now()}`,
        roomId: activeRoom.id,
        senderId: 'me',
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
        senderId: 'me',
        senderName: currentUserName,
        timestamp: '방금',
        isMine: true,
        shareCard,
      },
    ]);
    setActiveShareType(null);
  };

  return {
    rooms: initialRooms,
    activeRoom,
    activeRoomId,
    setActiveRoomId,
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
