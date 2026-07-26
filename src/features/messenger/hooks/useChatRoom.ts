import { useEffect, useRef, useState } from 'react';
import type {
  CARD_MESSAGE_TYPES,
  ChatFilter,
  ChatRoomCategory,
  ChatRoomMember,
  ChatShareCard,
  ShareCardType,
} from '@/features/messenger/types';
import { useChatMessages, useChatRoomDetail, useChatRooms } from './useChatRoomQueries';
import {
  useCreateChatRoom,
  useDeleteChatRoom,
  useInviteMembers,
  useMarkAsRead,
  useRemoveMember,
  useSendCardMessage,
  useSendMessage,
  useTransferOwner,
  useUpdateMemberSettings,
} from './useChatRoomMutations';

const matchesFilter = (category: ChatRoomCategory, unreadCount: number, filter: ChatFilter) => {
  switch (filter) {
    case 'group':
      return category === 'group';
    case 'notice':
      return category === 'notice';
    case 'unread':
      return unreadCount > 0;
    default:
      return true;
  }
};

const CARD_TYPE_BY_SHARE_TYPE: Record<ShareCardType, (typeof CARD_MESSAGE_TYPES)[number]> = {
  chore: 'CARD_CHORE',
  expense: 'CARD_EXPENSE',
  item: 'CARD_SUPPLY',
  rule: 'CARD_RULE',
};

type ChatMessageItem = ReturnType<typeof useChatMessages>['messages'][number];

interface ChatMessageGroup {
  key: string;
  senderId: string;
  senderName: string;
  senderAvatarUrl?: string;
  isMine: boolean;
  items: ChatMessageItem[];
}

const groupMessagesBySender = (messages: ChatMessageItem[]): ChatMessageGroup[] => {
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

export const useChatRoom = (groupId: string | null, currentUserId: string) => {
  const [activeRoomId, setActiveRoomIdState] = useState('');
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
  // TODO: 웹소켓 연동 전까지는 REST 요청 성공 여부로만 연결 상태를 판단 (이번 라운드는 REST만 연동)
  const [isConnected] = useState(true);

  const { data: rooms, isLoading: isRoomsLoading } = useChatRooms(groupId);
  const { data: activeRoom } = useChatRoomDetail(activeRoomId || null, currentUserId);

  // 메시지 응답에 sender(닉네임/프로필사진)가 아직 없어서, 채팅방 멤버 목록으로 대체 조회할 때 쓴다.
  const memberLookup = new Map(
    (activeRoom?.members ?? []).map(member => [member.id, { name: member.name, avatarUrl: member.avatarUrl }]),
  );

  const {
    messages: messageItems,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useChatMessages(activeRoomId || null, currentUserId, memberLookup);

  const createRoomMutation = useCreateChatRoom(groupId);
  const deleteRoomMutation = useDeleteChatRoom(groupId);
  const inviteMembersMutation = useInviteMembers(groupId);
  const removeMemberMutation = useRemoveMember(groupId);
  const transferOwnerMutation = useTransferOwner();
  const sendMessageMutation = useSendMessage();
  const sendCardMessageMutation = useSendCardMessage();
  const markAsReadMutation = useMarkAsRead(groupId);
  const updateMemberSettingsMutation = useUpdateMemberSettings();

  // 방을 전환할 때는 항상 읽음 처리도 같이 호출한다 (자동 첫 방 선택, 삭제/나가기 후 다음 방
  // 전환 등 모든 경로에서 빠뜨리기 쉬워서 한 곳으로 모음).
  const focusRoom = (roomId: string) => {
    setActiveRoomIdState(roomId);
    if (roomId) markAsReadMutation.mutate(roomId);
  };

  // 최초 진입 시에만 첫 방을 자동 선택한다. 방 삭제/나가기 이후의 "다음 방 선택"은
  // 각 액션이 자체적으로 처리하므로, 목록 갱신 타이밍에 맞춰 여기서 다시 개입하지 않는다
  // (그렇지 않으면 삭제 직후 아직 갱신 전인 목록 때문에 방금 지운 방이 재선택되는 경쟁 상태가 생김).
  const hasAutoSelectedRef = useRef(false);
  useEffect(() => {
    if (!hasAutoSelectedRef.current && !activeRoomId && rooms.length > 0) {
      hasAutoSelectedRef.current = true;
      focusRoom(rooms[0].id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeRoomId, rooms]);

  const filteredRooms = rooms
    .filter(room => matchesFilter(room.category, room.unreadCount, filter))
    .filter(room => !searchQuery.trim() || room.name.toLowerCase().includes(searchQuery.trim().toLowerCase()))
    .sort((a, b) => Number(b.isPinned) - Number(a.isPinned));

  const messageGroups = groupMessagesBySender(messageItems);

  const setActiveRoomId = (roomId: string) => {
    focusRoom(roomId);
    setDraft('');
    setIsManagePanelOpen(false);
  };

  const sendMessage = () => {
    const content = draft.trim();
    if (!content || !activeRoomId) return;
    sendMessageMutation.mutate({ roomId: activeRoomId, content });
    setDraft('');
  };

  const shareItem = (shareCard: ChatShareCard, refId: string) => {
    if (!activeRoomId) return;
    sendCardMessageMutation.mutate({ roomId: activeRoomId, type: CARD_TYPE_BY_SHARE_TYPE[shareCard.type], refId });
    setActiveShareType(null);
  };

  const createRoom = ({ name, category }: { name: string; category: ChatRoomCategory; memberIds: string[] }) => {
    createRoomMutation.mutate(
      { name, category },
      {
        onSuccess: room => {
          focusRoom(room.id);
          setIsCreateRoomOpen(false);
        },
      },
    );
  };

  const deleteActiveRoom = () => {
    if (!activeRoomId) return;
    const nextRoomId = rooms.find(room => room.id !== activeRoomId)?.id ?? '';
    deleteRoomMutation.mutate(activeRoomId, {
      onSuccess: () => {
        focusRoom(nextRoomId);
        setIsDeleteRoomOpen(false);
        setIsManagePanelOpen(false);
      },
    });
  };

  const leaveActiveRoom = () => {
    if (!activeRoomId || !activeRoom) return;
    const isOwner = activeRoom.members.some(member => member.id === currentUserId && member.isOwner);
    const otherMembers = activeRoom.members.filter(member => member.id !== currentUserId);

    if (isOwner && otherMembers.length > 0) {
      setIsDelegateOpen(true);
      return;
    }

    const nextRoomId = rooms.find(room => room.id !== activeRoomId)?.id ?? '';
    removeMemberMutation.mutate(
      { roomId: activeRoomId, userId: currentUserId },
      {
        onSuccess: () => {
          focusRoom(nextRoomId);
          setIsManagePanelOpen(false);
        },
      },
    );
  };

  const delegateAndLeave = (newOwnerId: string) => {
    if (!activeRoomId) return;
    const nextRoomId = rooms.find(room => room.id !== activeRoomId)?.id ?? '';
    transferOwnerMutation.mutate(
      { roomId: activeRoomId, userId: newOwnerId },
      {
        onSuccess: () => {
          removeMemberMutation.mutate(
            { roomId: activeRoomId, userId: currentUserId },
            {
              onSuccess: () => {
                focusRoom(nextRoomId);
                setIsDelegateOpen(false);
                setIsManagePanelOpen(false);
              },
            },
          );
        },
      },
    );
  };

  const kickMember = (member: ChatRoomMember) => {
    if (!activeRoomId) return;
    removeMemberMutation.mutate({ roomId: activeRoomId, userId: member.id }, { onSuccess: () => setKickTarget(null) });
  };

  const transferOwnership = (member: ChatRoomMember) => {
    if (!activeRoomId) return;
    transferOwnerMutation.mutate(
      { roomId: activeRoomId, userId: member.id },
      { onSuccess: () => setTransferOwnerTarget(null) },
    );
  };

  const inviteMembers = (memberIds: string[]) => {
    if (!activeRoomId) return;
    inviteMembersMutation.mutate(
      { roomId: activeRoomId, userIds: memberIds },
      { onSuccess: () => setIsInviteOpen(false) },
    );
  };

  const toggleNotification = (enabled: boolean) => {
    if (!activeRoomId) return;
    updateMemberSettingsMutation.mutate({ roomId: activeRoomId, notificationEnabled: enabled });
  };

  const togglePin = (pinned: boolean) => {
    if (!activeRoomId) return;
    updateMemberSettingsMutation.mutate({ roomId: activeRoomId, isPinned: pinned });
  };

  return {
    rooms,
    totalRoomCount: rooms.length,
    filteredRooms,
    isRoomsLoading,
    isConnected,
    activeRoom,
    activeRoomId,
    setActiveRoomId,
    messageGroups,
    fetchOlderMessages: fetchNextPage,
    hasOlderMessages: hasNextPage,
    isFetchingOlderMessages: isFetchingNextPage,
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
