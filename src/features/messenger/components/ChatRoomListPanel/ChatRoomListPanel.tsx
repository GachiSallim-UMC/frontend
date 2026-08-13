import { Plus, Search, X } from 'lucide-react';
import { cn } from '@/shared/lib/cn';
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
  /** 모바일: 채팅방이 열려있을 때 목록을 숨기기 위한 오버라이드 */
  className?: string;
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
  className,
}: ChatRoomListPanelProps) => {
  const trimmedQuery = searchQuery.trim();
  const isEmptySearchResult = rooms.length === 0 && trimmedQuery !== '';

  return (
    <div
      className={cn(
        'flex h-full w-full shrink-0 flex-col pb-4 lg:w-[294px] lg:border-r lg:border-gray-100',
        className,
      )}
    >
      <div className="hidden h-[72px] shrink-0 items-center justify-between pl-6 pr-4 lg:flex">
        <div className="flex items-baseline gap-1.5">
          <h2 className="text-[20px] font-semibold leading-[normal] text-gray-900">채팅방</h2>
          <span className="text-[20px] font-semibold leading-[normal] text-gray-500">{totalRoomCount}</span>
        </div>
        {!isEmptySearchResult && (
          <button
            type="button"
            onClick={() => onCreateRoom()}
            aria-label="새 채팅방"
            className="flex h-[34px] items-center gap-[2px] rounded-md bg-primary-600 px-3 text-[12px] font-normal leading-[normal] text-white transition-colors hover:bg-primary-700"
          >
            <Plus className="h-[18px] w-[18px]" />
            새 채팅방
          </button>
        )}
      </div>

      <div className="flex flex-col gap-3 pt-3 lg:px-4 lg:pt-0">
        <div className="flex items-center gap-2">
          <div className="flex h-11 flex-1 items-center gap-2 rounded-lg border border-gray-100 bg-white px-4 lg:h-[50px] lg:border-0 lg:bg-gray-100 lg:px-6">
            <Search className="h-4 w-4 shrink-0 text-gray-500 lg:h-[18px] lg:w-[18px]" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => onSearchQueryChange(e.target.value)}
              placeholder="채팅방 · 멤버 검색"
              className="w-full bg-transparent text-[14px] text-gray-900 placeholder:text-gray-500 focus:outline-none lg:text-[16px]"
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
          {!isEmptySearchResult && (
            <button
              type="button"
              onClick={() => onCreateRoom()}
              aria-label="새 채팅방"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary-600 text-white transition-colors hover:bg-primary-700 lg:hidden"
            >
              <Plus className="h-5 w-5" />
            </button>
          )}
        </div>
        <ChatFilterChips options={FILTER_OPTIONS} value={filter} onChange={onFilterChange} className="hidden lg:flex" />
      </div>

      <div
        className={`mt-3 flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto lg:gap-3 lg:px-4 ${!isConnected ? 'opacity-50' : ''}`}
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
                {/* 모바일: 카테고리별로 하나의 카드에 묶어서 표시. lg:contents로 이 박스 자체를 없애면
                    데스크톱은 각 ChatRoomItem이 부모의 gap-2 목록에 개별 카드로 바로 배치된다. */}
                <div className="flex flex-col overflow-hidden rounded-lg border border-gray-100 bg-white lg:contents">
                  {roomsInCategory.map((room, index) => (
                    <ChatRoomItem
                      key={room.id}
                      name={room.name}
                      lastMessage={room.lastMessage}
                      timestamp={room.timestamp}
                      avatarUrl={room.avatarUrl}
                      thumbnailUrl={CATEGORY_THUMBNAIL[room.category]}
                      memberCount={room.category === 'group' ? (room.memberCount ?? room.members.length) : undefined}
                      unreadCount={room.unreadCount}
                      isActive={room.id === activeRoomId}
                      isLast={index === roomsInCategory.length - 1}
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
