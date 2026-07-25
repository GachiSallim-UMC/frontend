import { useEffect, useMemo, useState } from 'react';
import type { User } from '@/shared/types';
import type {
  ChatFilter,
  ChatMessage,
  ChatMessageGroup,
  ChatRoom,
  ChatRoomCategory,
  ChatRoomMember,
  ChatShareCard,
  ShareCardType,
} from '@/features/messenger/types';

const groupMessagesBySender = (messages: ChatMessage[]): ChatMessageGroup[] => {
  const groups: ChatMessageGroup[] = [];
  messages.forEach(message => {
    const lastGroup = groups[groups.length - 1];
    if (lastGroup && lastGroup.senderId === message.senderId) {
      lastGroup.items.push(message);
    } else {
      groups.push({
        key: message.id,
        senderId: message.senderId,
        senderName: message.senderName,
        senderAvatarUrl: message.senderAvatarUrl,
        isMine: message.isMine,
        items: [message],
      });
    }
  });
  return groups;
};

/** 기존 목데이터 표기(예: '오전 10:06')와 맞춘 현재 시각 포맷 */
const formatTimestamp = (date: Date) => {
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const period = hours < 12 ? '오전' : '오후';
  const displayHour = hours % 12 === 0 ? 12 : hours % 12;
  return `${period} ${displayHour}:${String(minutes).padStart(2, '0')}`;
};

const matchesFilter = (room: ChatRoom, filter: ChatFilter) => {
  switch (filter) {
    case 'group':
      return room.category === 'group';
    case 'notice':
      return room.category === 'notice';
    case 'unread':
      return room.unreadCount > 0;
    default:
      return true;
  }
};

export const useChatRoom = (
  initialRooms: ChatRoom[],
  initialMessages: ChatMessage[],
  currentUserId: string,
  currentUserName: string,
  allUsers: User[] = [],
) => {
  const [rooms, setRooms] = useState(initialRooms);
  const [activeRoomId, setActiveRoomId] = useState(initialRooms[0]?.id ?? '');
  const [messages, setMessages] = useState(initialMessages);
  const [draft, setDraft] = useState('');
  const [activeShareType, setActiveShareType] = useState<ShareCardType | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [filter, setFilter] = useState<ChatFilter>('all');

  const [isManagePanelOpen, setIsManagePanelOpen] = useState(false);
  const [isCreateRoomOpen, setIsCreateRoomOpen] = useState(false);
  const [createRoomInitialName, setCreateRoomInitialName] = useState('');
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [isDeleteRoomOpen, setIsDeleteRoomOpen] = useState(false);
  const [isDelegateOpen, setIsDelegateOpen] = useState(false);
  const [kickTarget, setKickTarget] = useState<ChatRoomMember | null>(null);
  const [transferOwnerTarget, setTransferOwnerTarget] = useState<ChatRoomMember | null>(null);
  // TODO: AWS 관리형 웹소켓 연동 시 실제 연결 상태로 교체
  const [isConnected] = useState(true);

  const activeRoom = rooms.find(room => room.id === activeRoomId);

  // 채팅방을 열람 중이면 안읽음 배지를 지운다 (최초 진입한 방 포함)
  useEffect(() => {
    setRooms(prev => prev.map(room => (room.id === activeRoomId ? { ...room, unreadCount: 0 } : room)));
  }, [activeRoomId]);

  const filteredRooms = useMemo(() => {
    const keyword = searchQuery.trim().toLowerCase();
    return rooms
      .filter(room => matchesFilter(room, filter))
      .filter(room => !keyword || room.name.toLowerCase().includes(keyword))
      .sort((a, b) => Number(b.isPinned) - Number(a.isPinned));
  }, [rooms, filter, searchQuery]);

  const messageGroups = useMemo(() => {
    const roomMessages = messages.filter(message => message.roomId === activeRoomId);
    return groupMessagesBySender(roomMessages);
  }, [messages, activeRoomId]);

  const selectRoom = (roomId: string) => {
    setActiveRoomId(roomId);
    setDraft('');
    setIsManagePanelOpen(false);
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
        timestamp: formatTimestamp(new Date()),
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
        timestamp: formatTimestamp(new Date()),
        isMine: true,
        shareCard,
      },
    ]);
    setActiveShareType(null);
  };

  const createRoom = ({
    name,
    category,
    memberIds,
  }: {
    name: string;
    category: ChatRoomCategory;
    memberIds: string[];
  }) => {
    const invitedMembers: ChatRoomMember[] = allUsers
      .filter(user => memberIds.includes(user.id))
      .map(user => ({ id: user.id, name: user.name }));

    const newRoom: ChatRoom = {
      id: `room-${Date.now()}`,
      name,
      lastMessage: '채팅방이 생성되었습니다.',
      timestamp: '방금',
      unreadCount: 0,
      category,
      members: [{ id: currentUserId, name: currentUserName, isOwner: true }, ...invitedMembers],
      notificationEnabled: true,
      isPinned: false,
    };

    setRooms(prev => [newRoom, ...prev]);
    setActiveRoomId(newRoom.id);
    setIsCreateRoomOpen(false);
  };

  const deleteActiveRoom = () => {
    if (!activeRoom) return;
    const remaining = rooms.filter(room => room.id !== activeRoom.id);
    setRooms(remaining);
    setActiveRoomId(remaining[0]?.id ?? '');
    setIsDeleteRoomOpen(false);
    setIsManagePanelOpen(false);
  };

  const leaveActiveRoom = () => {
    if (!activeRoom) return;
    const isOwner = activeRoom.members.some(member => member.id === currentUserId && member.isOwner);
    const otherMembers = activeRoom.members.filter(member => member.id !== currentUserId);

    if (isOwner && otherMembers.length > 0) {
      setIsDelegateOpen(true);
      return;
    }

    const remaining = rooms.filter(room => room.id !== activeRoom.id);
    setRooms(remaining);
    setActiveRoomId(remaining[0]?.id ?? '');
    setIsManagePanelOpen(false);
  };

  // newOwnerId는 이후 API 연동 시 방장 위임 요청 payload로 사용된다.
  // 현재는 로컬 mock이라 방을 나가면 내 시점의 목록에서 사라지는 것만 반영한다.
  const delegateAndLeave = (_newOwnerId: string) => {
    if (!activeRoom) return;
    const remaining = rooms.filter(room => room.id !== activeRoom.id);
    setRooms(remaining);
    setActiveRoomId(remaining[0]?.id ?? '');
    setIsDelegateOpen(false);
    setIsManagePanelOpen(false);
  };

  const kickMember = (member: ChatRoomMember) => {
    if (!activeRoom) return;
    setRooms(prev =>
      prev.map(room =>
        room.id === activeRoom.id
          ? { ...room, members: room.members.filter(existing => existing.id !== member.id) }
          : room,
      ),
    );
    setKickTarget(null);
  };

  const transferOwnership = (member: ChatRoomMember) => {
    if (!activeRoom) return;
    setRooms(prev =>
      prev.map(room =>
        room.id === activeRoom.id
          ? { ...room, members: room.members.map(existing => ({ ...existing, isOwner: existing.id === member.id })) }
          : room,
      ),
    );
    setTransferOwnerTarget(null);
  };

  const inviteMembers = (memberIds: string[]) => {
    if (!activeRoom) return;
    const invitedMembers: ChatRoomMember[] = allUsers
      .filter(user => memberIds.includes(user.id))
      .map(user => ({ id: user.id, name: user.name }));

    setRooms(prev =>
      prev.map(room => (room.id === activeRoom.id ? { ...room, members: [...room.members, ...invitedMembers] } : room)),
    );
    setIsInviteOpen(false);
  };

  const toggleNotification = (enabled: boolean) => {
    if (!activeRoom) return;
    setRooms(prev => prev.map(room => (room.id === activeRoom.id ? { ...room, notificationEnabled: enabled } : room)));
  };

  const togglePin = (pinned: boolean) => {
    if (!activeRoom) return;
    setRooms(prev => prev.map(room => (room.id === activeRoom.id ? { ...room, isPinned: pinned } : room)));
  };

  return {
    rooms,
    totalRoomCount: rooms.length,
    filteredRooms,
    isConnected,
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

    searchQuery,
    setSearchQuery,
    filter,
    setFilter,

    isManagePanelOpen,
    openManagePanel: () => setIsManagePanelOpen(true),
    closeManagePanel: () => setIsManagePanelOpen(false),

    isCreateRoomOpen,
    createRoomInitialName,
    openCreateRoom: (initialName = '') => {
      setCreateRoomInitialName(initialName);
      setIsCreateRoomOpen(true);
    },
    closeCreateRoom: () => setIsCreateRoomOpen(false),
    createRoom,

    isInviteOpen,
    openInvite: () => setIsInviteOpen(true),
    closeInvite: () => setIsInviteOpen(false),
    inviteMembers,

    isDeleteRoomOpen,
    openDeleteRoom: () => setIsDeleteRoomOpen(true),
    closeDeleteRoom: () => setIsDeleteRoomOpen(false),
    deleteActiveRoom,

    isDelegateOpen,
    closeDelegate: () => setIsDelegateOpen(false),
    delegateAndLeave,

    leaveActiveRoom,

    kickTarget,
    requestKickMember: setKickTarget,
    closeKickMember: () => setKickTarget(null),
    kickMember,

    transferOwnerTarget,
    requestTransferOwner: setTransferOwnerTarget,
    closeTransferOwner: () => setTransferOwnerTarget(null),
    transferOwnership,

    toggleNotification,
    togglePin,
  };
};
