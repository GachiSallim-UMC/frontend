import {
  ChatBubble,
  ChatHeader,
  ChatInputBar,
  ChatRoomListPanel,
  ShareItemPickerModal,
  useChatRoom,
} from '@/features/messenger';
import { chores, expenses, items, rules, chatRooms, chatMessages, currentUser, users } from '@/pages/_shared/mockData';
import { buildShareCard, getShareOptions } from '@/pages/messenger/shareOptions';

export const MessengerPage = () => {
  const {
    rooms,
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
  } = useChatRoom(chatRooms, chatMessages, currentUser.id, currentUser.name);

  const shareSourceData = { chores, expenses, items, rules };

  const handleSelectShareOption = (optionId: string) => {
    if (!activeShareType) return;
    const shareCard = buildShareCard(activeShareType, optionId, shareSourceData);
    if (shareCard) shareItem(shareCard);
  };

  return (
    <div className="flex w-full flex-1 min-h-0 justify-center bg-gray-50">
      <div className="flex h-full w-full flex-col items-center px-4 pb-[28px] pt-[28px] lg:max-w-[1180px]">
        <div className="flex w-full flex-1 min-h-0 overflow-hidden rounded-[20px] bg-white shadow-card lg:max-w-[1114px]">
          <ChatRoomListPanel rooms={rooms} activeRoomId={activeRoomId} onSelectRoom={setActiveRoomId} />

          {activeRoom && (
            <div className="flex min-w-0 flex-1 flex-col">
              <ChatHeader
                roomName={activeRoom.name}
                memberCount={users.length}
                onlineMembers={users.slice(0, 2).map(user => user.name)}
              />

              <div className="flex flex-1 flex-col gap-5 overflow-y-auto bg-gray-50 px-[30px] py-6">
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
                      timestamp={group.timestamp}
                      isMine={group.isMine}
                      items={group.items}
                    />
                  ))
                )}
              </div>

              <ChatInputBar value={draft} onChange={setDraft} onSend={sendMessage} onSelectShareType={openSharePicker} />
            </div>
          )}
        </div>
      </div>

      <ShareItemPickerModal
        type={activeShareType}
        options={activeShareType ? getShareOptions(activeShareType, shareSourceData) : []}
        onSelect={handleSelectShareOption}
        onClose={closeSharePicker}
      />
    </div>
  );
};
