import { useEffect, useRef, useState } from 'react';
import { useLocation, useSearchParams } from 'react-router-dom';
import {
  ChatBubble,
  ChatHeader,
  ChatInputBar,
  ChatRoomListPanel,
  ChatRoomManagePanel,
  CreateChatRoomModal,
  DateDivider,
  DelegateOwnerModal,
  DeleteChatRoomModal,
  EmptyChatState,
  InviteMemberModal,
  KickMemberModal,
  ShareItemPickerModal,
  TransferOwnerModal,
  useChatRoom,
} from '@/features/messenger';
import type { ChatMessageGroup } from '@/features/messenger';
import { useGroupMembers } from '@/features/member';
import { useMe } from '@/features/auth';
import { useAuthStore, useGroupStore } from '@/shared/store';
import { useChores } from '@/features/chore';
import { useExpenseList } from '@/features/expense';
import { useItems } from '@/features/item';
import { useRules } from '@/features/rule';
import { buildShareCard, getShareOptions } from '@/pages/messenger/shareOptions';
import { useShareCardActions } from '@/pages/messenger/useShareCardActions';
import { cn } from '@/shared/lib/cn';

type TimelineEntry =
  | { type: 'date'; key: string; date: string }
  | { type: 'group'; key: string; group: ChatMessageGroup };

/** 메시지 그룹 사이에 날짜가 바뀌는 지점마다 날짜 구분선 항목을 끼워 넣는다. */
const buildTimeline = (groups: ChatMessageGroup[]): TimelineEntry[] => {
  const timeline: TimelineEntry[] = [];
  let lastDateKey = '';

  groups.forEach(group => {
    const firstItemDate = group.items[0].createdAt;
    const dateKey = new Date(firstItemDate).toDateString();
    if (dateKey !== lastDateKey) {
      timeline.push({ type: 'date', key: `date-${dateKey}`, date: firstItemDate });
      lastDateKey = dateKey;
    }
    timeline.push({ type: 'group', key: group.key, group });
  });

  return timeline;
};

export const MessengerPage = () => {
  const groupId = useGroupStore(s => s.selectedGroupId);
  const currentUserId = useAuthStore(s => s.userId) ?? '';
  const numericGroupId = groupId ? Number(groupId) : undefined;
  const [searchParams] = useSearchParams();
  // 메신저 공유(useShareToMessenger)는 state로, 알림 클릭(NEW_MESSAGE)은 쿼리스트링으로 roomId를 넘긴다.
  const initialRoomId =
    (useLocation().state as { roomId?: string } | null)?.roomId ?? searchParams.get('roomId') ?? undefined;

  const { data: groupMembers } = useGroupMembers(groupId);
  const { data: me } = useMe();

  const { data: chores = [] } = useChores(
    numericGroupId && Number.isSafeInteger(numericGroupId) ? { groupId: numericGroupId } : undefined,
  );
  const { data: items = [] } = useItems();
  const { data: rules = [] } = useRules();
  const { expenses } = useExpenseList('TOTAL');

  const {
    filteredRooms,
    totalRoomCount,
    isConnected,
    activeRoom,
    activeRoomId,
    setActiveRoomId,
    messageGroups,
    draft,
    setDraft,
    sendMessage,
    retrySendMessage,
    deleteFailedMessage,
    activeShareType,
    openSharePicker,
    closeSharePicker,
    shareItem,

    searchQuery,
    setSearchQuery,
    filter,
    setFilter,

    isManagePanelOpen,
    openManagePanel,
    closeManagePanel,

    isCreateRoomOpen,
    createRoomInitialName,
    openCreateRoom,
    closeCreateRoom,
    createRoom,

    isInviteOpen,
    openInvite,
    closeInvite,
    inviteMembers,

    isDeleteRoomOpen,
    openDeleteRoom,
    closeDeleteRoom,
    deleteActiveRoom,

    isDelegateOpen,
    closeDelegate,
    delegateAndLeave,

    leaveActiveRoom,

    kickTarget,
    requestKickMember,
    closeKickMember,
    kickMember,

    transferOwnerTarget,
    requestTransferOwner,
    closeTransferOwner,
    transferOwnership,

    toggleNotification,
    togglePin,
  } = useChatRoom(groupId, currentUserId, initialRoomId);

  const messageListRef = useRef<HTMLDivElement>(null);

  // 방 전환/새 메시지 시 맨 아래로 스크롤
  useEffect(() => {
    messageListRef.current?.scrollTo({ top: messageListRef.current.scrollHeight });
  }, [activeRoomId, messageGroups]);

  // 모바일 전용: 목록/채팅방 중 어느 화면을 보여줄지. 데스크톱은 항상 둘 다 보여주므로 영향 없음.
  // rooms 로드 후 첫 방이 자동 선택되더라도(activeRoomId), 모바일에서는 사용자가 직접 방을
  // 선택하기 전까지 목록 화면을 유지해야 하므로 activeRoomId와 별개로 관리한다.
  const [mobileView, setMobileView] = useState<'list' | 'room'>(initialRoomId ? 'room' : 'list');

  const handleSelectRoom = (roomId: string) => {
    setActiveRoomId(roomId);
    setMobileView('room');
  };

  const handleBackToList = () => setMobileView('list');

  const shareSourceData = { chores, expenses, items, rules };

  const handleSelectShareOption = (optionId: string) => {
    if (!activeShareType) return;
    const shareCard = buildShareCard(activeShareType, optionId, shareSourceData);
    if (shareCard) shareItem(shareCard, optionId);
  };

  const { enrichedMessageGroups, handleViewShareDetail, handleShareAction, pendingActionIds } =
    useShareCardActions(messageGroups, shareSourceData, currentUserId);

  const createRoomCandidates = groupMembers
    .filter(member => !member.leftAt && member.userId !== currentUserId)
    .map(member => ({
      id: member.userId,
      name: member.user.nickname,
      avatarUrl: member.user.profileImage ?? undefined,
    }));

  // 1:1 대화방 목록 응답엔 상대 프로필 사진이 없어서(방 이름 = 상대 닉네임), 그룹 멤버 목록에서 대신 찾는다.
  // 닉네임이 겹치는 멤버가 있으면 마지막 매치로 덮어써진다 — 목록 응답에 상대 id가 없어 감수하는 한계.
  const avatarByNickname = new Map(groupMembers.map(member => [member.user.nickname, member.user.profileImage]));
  const roomsForList = filteredRooms.map(room =>
    room.category === 'dm' && !room.avatarUrl
      ? { ...room, avatarUrl: avatarByNickname.get(room.name) ?? undefined }
      : room,
  );

  const inviteCandidates = activeRoom
    ? createRoomCandidates.filter(candidate => !activeRoom.members.some(member => member.id === candidate.id))
    : [];

  const delegateCandidates = activeRoom
    ? activeRoom.members.filter(member => member.id !== currentUserId)
    : [];

  const currentGroupMember = groupMembers.find(member => member.userId === currentUserId);
  const currentUserName = me?.nickname ?? currentGroupMember?.user.nickname ?? '';
  const currentUserAvatarUrl = me?.profileImage ?? currentGroupMember?.user.profileImage ?? undefined;

  return (
    <div className="flex w-full flex-1 min-h-0 bg-primary-50 lg:bg-gray-50">
      <div className="flex h-full w-full flex-col lg:pb-[28px]">
        <div className="relative flex w-full flex-1 min-h-0 lg:overflow-hidden lg:rounded-[20px] lg:bg-white">
          <div className="relative flex min-w-0 flex-1">
            <ChatRoomListPanel
              rooms={roomsForList}
              totalRoomCount={totalRoomCount}
              activeRoomId={activeRoomId}
              onSelectRoom={handleSelectRoom}
              searchQuery={searchQuery}
              onSearchQueryChange={setSearchQuery}
              filter={filter}
              onFilterChange={setFilter}
              onCreateRoom={openCreateRoom}
              isConnected={isConnected}
              className={cn(mobileView === 'room' && 'hidden lg:flex')}
            />

            {activeRoom ? (
              // 모바일 z-index(45~47, 아래 관리 패널까지)는 항상 공용 Modal(z-50)보다 낮게 유지한다.
              // 안 그러면 관리 패널을 열어둔 채로 뜨는 초대/삭제 등 Modal이 패널에 가려진다.
              <div
                className={cn(
                  'flex min-w-0 flex-1 flex-col bg-white',
                  mobileView === 'room' ? 'fixed inset-0 z-[45] lg:static lg:z-auto' : 'hidden lg:flex',
                )}
              >
                <ChatHeader
                  roomName={activeRoom.name}
                  memberCount={activeRoom.memberCount ?? activeRoom.members.length}
                  onOpenManage={openManagePanel}
                  isConnected={isConnected}
                  onBack={handleBackToList}
                />

                <div
                  ref={messageListRef}
                  className="flex flex-1 flex-col gap-4 overflow-y-auto bg-gray-50 px-4 py-4 lg:gap-5 lg:px-[30px] lg:py-6"
                >
                  {enrichedMessageGroups.length === 0 ? (
                    <div className="flex flex-1 items-center justify-center text-caption text-gray-500">
                      아직 주고받은 메시지가 없습니다.
                    </div>
                  ) : (
                    buildTimeline(enrichedMessageGroups).map(entry =>
                      entry.type === 'date' ? (
                        <DateDivider key={entry.key} date={entry.date} />
                      ) : (
                        <ChatBubble
                          key={entry.key}
                          senderName={entry.group.senderName}
                          senderAvatarUrl={entry.group.senderAvatarUrl}
                          isMine={entry.group.isMine}
                          items={entry.group.items}
                          onViewShareDetail={handleViewShareDetail}
                          onShareAction={handleShareAction}
                          pendingShareActionIds={pendingActionIds}
                          onRetryFailedMessage={retrySendMessage}
                          onDeleteFailedMessage={deleteFailedMessage}
                        />
                      ),
                    )
                  )}
                </div>

                <ChatInputBar
                  value={draft}
                  onChange={setDraft}
                  onSend={sendMessage}
                  onSelectShareType={openSharePicker}
                />
              </div>
            ) : (
              <EmptyChatState onCreateRoom={openCreateRoom} isConnected={isConnected} className="hidden lg:flex" />
            )}

            {isManagePanelOpen && (
              <button
                type="button"
                aria-label="채팅방 관리 닫기"
                onClick={closeManagePanel}
                className="fixed inset-0 z-[46] cursor-default bg-black/40 lg:absolute lg:z-10"
              />
            )}
          </div>

          {isManagePanelOpen && activeRoom && (
            <ChatRoomManagePanel
              room={activeRoom}
              currentUserId={currentUserId}
              onClose={closeManagePanel}
              onInviteMember={openInvite}
              onKickMember={requestKickMember}
              onRequestTransferOwner={requestTransferOwner}
              onToggleNotification={toggleNotification}
              onTogglePin={togglePin}
              onLeaveRoom={leaveActiveRoom}
              onDeleteRoom={openDeleteRoom}
              className="fixed inset-0 z-[47] w-full shadow-dropdown lg:absolute lg:inset-auto lg:right-0 lg:top-0 lg:z-20 lg:w-[360px]"
            />
          )}
        </div>
      </div>

      <ShareItemPickerModal
        type={activeShareType}
        options={activeShareType ? getShareOptions(activeShareType, shareSourceData) : []}
        onSelect={handleSelectShareOption}
        onClose={closeSharePicker}
      />

      <CreateChatRoomModal
        isOpen={isCreateRoomOpen}
        onClose={closeCreateRoom}
        currentUser={{ name: currentUserName, avatarUrl: currentUserAvatarUrl }}
        candidateMembers={createRoomCandidates}
        onCreate={createRoom}
        initialName={createRoomInitialName}
      />

      <InviteMemberModal
        isOpen={isInviteOpen}
        onClose={closeInvite}
        candidateMembers={inviteCandidates}
        onInvite={inviteMembers}
      />

      {activeRoom && (
        <DeleteChatRoomModal
          isOpen={isDeleteRoomOpen}
          roomName={activeRoom.name}
          onClose={closeDeleteRoom}
          onConfirm={deleteActiveRoom}
        />
      )}

      <DelegateOwnerModal
        isOpen={isDelegateOpen}
        candidates={delegateCandidates}
        onClose={closeDelegate}
        onConfirm={delegateAndLeave}
      />

      <KickMemberModal member={kickTarget} onClose={closeKickMember} onConfirm={kickMember} />

      <TransferOwnerModal
        member={transferOwnerTarget}
        onClose={closeTransferOwner}
        onConfirm={transferOwnership}
      />
    </div>
  );
};
