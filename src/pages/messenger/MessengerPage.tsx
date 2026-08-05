import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import {
  ChatBubble,
  ChatHeader,
  ChatInputBar,
  ChatRoomListPanel,
  ChatRoomManagePanel,
  CreateChatRoomModal,
  DelegateOwnerModal,
  DeleteChatRoomModal,
  EmptyChatState,
  InviteMemberModal,
  KickMemberModal,
  ShareItemPickerModal,
  TransferOwnerModal,
  useChatRoom,
} from '@/features/messenger';
import { useGroupMembers } from '@/features/member';
import { useMe } from '@/features/auth';
import { useAuthStore, useGroupStore } from '@/shared/store';
import { useChores } from '@/features/chore';
import { useExpenseList } from '@/features/expense';
import { useItems } from '@/features/item';
import { useRules } from '@/features/rule';
import { buildShareCard, getShareOptions } from '@/pages/messenger/shareOptions';
import { useShareCardActions } from '@/pages/messenger/useShareCardActions';

export const MessengerPage = () => {
  const groupId = useGroupStore(s => s.selectedGroupId);
  const currentUserId = useAuthStore(s => s.userId) ?? '';
  const numericGroupId = groupId ? Number(groupId) : undefined;
  const initialRoomId = (useLocation().state as { roomId?: string } | null)?.roomId;

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

  const inviteCandidates = activeRoom
    ? createRoomCandidates.filter(candidate => !activeRoom.members.some(member => member.id === candidate.id))
    : [];

  const delegateCandidates = activeRoom
    ? activeRoom.members.filter(member => member.id !== currentUserId)
    : [];

  const currentUserName =
    me?.nickname ?? groupMembers.find(member => member.userId === currentUserId)?.user.nickname ?? '';

  return (
    <div className="flex w-full flex-1 min-h-0 justify-center bg-gray-50">
      <div className="flex h-full w-full flex-col items-center px-4 pb-[28px] pt-[28px] lg:max-w-[1180px]">
        <div className="relative flex w-full flex-1 min-h-0 overflow-hidden rounded-[20px] bg-white shadow-card lg:max-w-[1114px]">
          <div className="relative flex min-w-0 flex-1">
            <ChatRoomListPanel
              rooms={filteredRooms}
              totalRoomCount={totalRoomCount}
              activeRoomId={activeRoomId}
              onSelectRoom={setActiveRoomId}
              searchQuery={searchQuery}
              onSearchQueryChange={setSearchQuery}
              filter={filter}
              onFilterChange={setFilter}
              onCreateRoom={openCreateRoom}
              isConnected={isConnected}
            />

            {activeRoom ? (
              <div className="flex min-w-0 flex-1 flex-col">
                <ChatHeader
                  roomName={activeRoom.name}
                  memberCount={activeRoom.memberCount ?? activeRoom.members.length}
                  onOpenManage={openManagePanel}
                  isConnected={isConnected}
                />

                <div
                  ref={messageListRef}
                  className="flex flex-1 flex-col gap-5 overflow-y-auto bg-gray-50 px-[30px] py-6"
                >
                  {enrichedMessageGroups.length === 0 ? (
                    <div className="flex flex-1 items-center justify-center text-caption text-gray-500">
                      아직 주고받은 메시지가 없습니다.
                    </div>
                  ) : (
                    enrichedMessageGroups.map(group => (
                      <ChatBubble
                        key={group.key}
                        senderName={group.senderName}
                        senderAvatarUrl={group.senderAvatarUrl}
                        isMine={group.isMine}
                        items={group.items}
                        onViewShareDetail={handleViewShareDetail}
                        onShareAction={handleShareAction}
                        pendingShareActionIds={pendingActionIds}
                        onRetryFailedMessage={retrySendMessage}
                        onDeleteFailedMessage={deleteFailedMessage}
                      />
                    ))
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
              <EmptyChatState onCreateRoom={openCreateRoom} isConnected={isConnected} />
            )}

            {isManagePanelOpen && (
              <button
                type="button"
                aria-label="채팅방 관리 닫기"
                onClick={closeManagePanel}
                className="absolute inset-0 z-10 cursor-default bg-black/40"
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
              className="absolute right-0 top-0 z-20 shadow-dropdown"
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
        currentUser={{ name: currentUserName }}
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
