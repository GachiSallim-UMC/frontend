import { ChatBubble, ChatHeader, ChatInputBar, ChatRoomListPanel, useChatRoom } from '@/features/messenger';
import { chatRooms, chatMessages, currentUser, users } from '@/pages/_shared/mockData';

export const MessengerPage = () => {
  const { rooms, activeRoom, activeRoomId, setActiveRoomId, messageGroups, draft, setDraft, sendMessage } =
    useChatRoom(chatRooms, chatMessages, currentUser.name);

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

              <ChatInputBar
                value={draft}
                onChange={setDraft}
                onSend={sendMessage}
                onSelectShareType={type => console.log('공유 타입 선택:', type)}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
