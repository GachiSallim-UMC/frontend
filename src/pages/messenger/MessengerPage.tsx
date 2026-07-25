import { useEffect, useRef } from 'react';
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
import { chores, expenses, items, rules, chatRooms, chatMessages, currentUser, users } from '@/pages/_shared/mockData';
import { buildShareCard, getShareOptions } from '@/pages/messenger/shareOptions';

export const MessengerPage = () => {
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
  } = useChatRoom(chatRooms, chatMessages, currentUser.id, currentUser.name, users);

  const messageListRef = useRef<HTMLDivElement>(null);

  // 방을 바꾸거나 메시지가 새로 추가되면 항상 최신 메시지가 보이도록 맨 아래로 내린다.
  useEffect(() => {
    messageListRef.current?.scrollTo({ top: messageListRef.current.scrollHeight });
  }, [activeRoomId, messageGroups]);

  const shareSourceData = { chores, expenses, items, rules };

  const handleSelectShareOption = (optionId: string) => {
    if (!activeShareType) return;
    const shareCard = buildShareCard(activeShareType, optionId, shareSourceData);
    if (shareCard) shareItem(shareCard);
  };

  const createRoomCandidates = users
    .filter(user => user.id !== currentUser.id)
    .map(user => ({ id: user.id, name: user.name }));

  const inviteCandidates = activeRoom
    ? createRoomCandidates.filter(candidate => !activeRoom.members.some(member => member.id === candidate.id))
    : [];

  const delegateCandidates = activeRoom
    ? activeRoom.members.filter(member => member.id !== currentUser.id)
    : [];

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
                  memberCount={activeRoom.members.length}
                  onlineMembers={users.slice(0, 2).map(user => user.name)}
                  onOpenManage={openManagePanel}
                  isConnected={isConnected}
                />

                <div
                  ref={messageListRef}
                  className="flex flex-1 flex-col gap-5 overflow-y-auto bg-gray-50 px-[30px] py-6"
                >
                  {messageGroups.length === 0 ? (
                    <div className="flex flex-1 items-center justify-center text-caption text-gray-500">
                      아직 주고받은 메시지가 없습니다.
                    </div>
                  ) : (
                    messageGroups.map(group => (
                      <ChatBubble
                        key={group.key}
                        senderName={group.senderName}
                        senderAvatarUrl={group.senderAvatarUrl}
                        isMine={group.isMine}
                        items={group.items}
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
              currentUserId={currentUser.id}
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
        currentUser={{ name: currentUser.name }}
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
