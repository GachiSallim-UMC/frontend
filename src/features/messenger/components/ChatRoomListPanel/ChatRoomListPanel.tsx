import type { ChatRoom } from '@/features/messenger/types';
import { ChatRoomItem } from '@/features/messenger/components/ChatRoomItem';

interface ChatRoomListPanelProps {
  rooms: ChatRoom[];
  activeRoomId: string;
  onSelectRoom: (roomId: string) => void;
}

export const ChatRoomListPanel = ({ rooms, activeRoomId, onSelectRoom }: ChatRoomListPanelProps) => {
  return (
    <div className="flex h-full w-[254px] shrink-0 flex-col border-r border-gray-100">
      <div className="flex h-[72px] shrink-0 items-center border-b border-gray-100 px-6">
        <h2 className="text-[20px] font-semibold leading-[normal] text-gray-900">채팅방</h2>
      </div>
      <div className="flex-1 overflow-y-auto">
        {rooms.map(room => (
          <ChatRoomItem
            key={room.id}
            name={room.name}
            lastMessage={room.lastMessage}
            timestamp={room.timestamp}
            unreadCount={room.unreadCount}
            isActive={room.id === activeRoomId}
            onClick={() => onSelectRoom(room.id)}
          />
        ))}
      </div>
    </div>
  );
};
