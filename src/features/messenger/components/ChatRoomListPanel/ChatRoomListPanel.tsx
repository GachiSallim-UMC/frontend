import { Plus, Search, X } from 'lucide-react';
import type { ChatFilter, ChatRoom, ChatRoomCategory } from '@/features/messenger/types';
import { ChatRoomItem } from '@/features/messenger/components/ChatRoomItem';
import { ChatFilterChips } from '@/features/messenger/components/ChatFilterChips';
import { ReconnectingBanner } from '@/features/messenger/components/ChatRoomListPanel/ReconnectingBanner';
import { NoSearchResults } from '@/features/messenger/components/ChatRoomListPanel/NoSearchResults';
import roomRoommateIcon from '@/assets/icons/messenger/room-roommate.png';
import roomNoticeIcon from '@/assets/icons/messenger/room-notice.png';

const CATEGORY_THUMBNAIL: Partial<Record<ChatRoomCategory, string>> = {
  group: roomRoommateIcon,
  notice: roomNoticeIcon,
};

interface ChatRoomListPanelProps {
  /** 필터·검색이 이미 적용된 목록 */
  rooms: ChatRoom[];
  /** 헤더에 표시할 전체 채팅방 수 (필터 적용 전) */
  totalRoomCount: number;
  activeRoomId: string;
  onSelectRoom: (roomId: string) => void;
  searchQuery: string;
  onSearchQueryChange: (value: string) => void;
  filter: ChatFilter;
  onFilterChange: (filter: ChatFilter) => void;
  onCreateRoom: (name?: string) => void;
  isConnected?: boolean;
}

const FILTER_OPTIONS: { value: ChatFilter; label: string }[] = [
  { value: 'all', label: '전체' },
  { value: 'group', label: '그룹' },
  { value: 'notice', label: '공지' },
  { value: 'unread', label: '안읽음' },
];

const CATEGORY_SECTIONS: { category: ChatRoomCategory; label: string }[] = [
  { category: 'group', label: '그룹 채팅' },
  { category: 'dm', label: '멤버와 1:1 대화' },
  { category: 'notice', label: '공지' },
];

export const ChatRoomListPanel = ({
  rooms,
  totalRoomCount,
  activeRoomId,
  onSelectRoom,
  searchQuery,
  onSearchQueryChange,
  filter,
  onFilterChange,
  onCreateRoom,
  isConnected = true,
}: ChatRoomListPanelProps) => {
  const trimmedQuery = searchQuery.trim();
  const isEmptySearchResult = rooms.length === 0 && trimmedQuery !== '';

  return (
    <div className="flex h-full w-[294px] shrink-0 flex-col border-r border-gray-100 pb-4">
      <div className="flex h-[72px] shrink-0 items-center justify-between pl-6 pr-4">
        <div className="flex items-baseline gap-1.5">
          <h2 className="text-[20px] font-semibold leading-[normal] text-gray-900">채팅방</h2>
          <span className="text-[20px] font-semibold leading-[normal] text-gray-500">{totalRoomCount}</span>
        </div>
        {!isEmptySearchResult && (
          <button
            type="button"
            onClick={() => onCreateRoom()}
            className="flex h-[34px] items-center gap-[2px] rounded-md bg-primary-600 px-3 text-[12px] font-normal leading-[normal] text-white transition-colors hover:bg-primary-700"
          >
            <Plus className="h-[18px] w-[18px]" />
            새 채팅방
          </button>
        )}
      </div>

      <div className="flex flex-col gap-3 px-4">
        <div className="flex h-[50px] items-center gap-2 rounded-lg bg-gray-100 px-6">
          <Search className="h-[18px] w-[18px] shrink-0 text-gray-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => onSearchQueryChange(e.target.value)}
            placeholder="채팅방 검색"
            className="w-full bg-transparent text-[16px] text-gray-900 placeholder:text-gray-500 focus:outline-none"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchQueryChange('')}
              aria-label="검색어 지우기"
              className="shrink-0 text-gray-500 hover:text-gray-700"
            >
              <X className="h-[16px] w-[16px]" />
            </button>
          )}
        </div>
        <ChatFilterChips options={FILTER_OPTIONS} value={filter} onChange={onFilterChange} />
      </div>

      <div
        className={`mt-3 flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-4 ${!isConnected ? 'opacity-50' : ''}`}
      >
        {rooms.length === 0 ? (
          isEmptySearchResult ? (
            <NoSearchResults query={trimmedQuery} onCreateRoom={onCreateRoom} />
          ) : (
            <p className="pt-8 text-center text-[14px] font-normal leading-[normal] text-gray-500">
              검색 결과가 없습니다.
            </p>
          )
        ) : (
          CATEGORY_SECTIONS.map(({ category, label }) => {
            const roomsInCategory = rooms.filter(room => room.category === category);
            if (roomsInCategory.length === 0) return null;

            return (
              <div key={category} className="flex flex-col gap-2">
                <h3 className="text-[14px] font-bold leading-[normal] text-gray-700">{label}</h3>
                <div className="flex flex-col gap-2">
                  {roomsInCategory.map(room => (
                    <ChatRoomItem
                      key={room.id}
                      name={room.name}
                      lastMessage={room.lastMessage}
                      timestamp={room.timestamp}
                      avatarUrl={room.avatarUrl}
                      thumbnailUrl={CATEGORY_THUMBNAIL[room.category]}
                      memberCount={room.category === 'group' ? room.members.length : undefined}
                      unreadCount={room.unreadCount}
                      isActive={room.id === activeRoomId}
                      onClick={() => onSelectRoom(room.id)}
                    />
                  ))}
                </div>
              </div>
            );
          })
        )}
      </div>

      {!isConnected && <ReconnectingBanner />}
    </div>
  );
};
