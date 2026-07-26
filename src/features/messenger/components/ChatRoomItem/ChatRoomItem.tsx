import { UserAvatar } from '@/shared/components/ui/UserAvatar';
import { cn } from '@/shared/lib/cn';

interface ChatRoomItemProps {
  name: string;
  lastMessage: string;
  timestamp: string;
  avatarUrl?: string;
  /** 지정 시 사람 아바타 대신 렌더링되는 방 썸네일 (그룹/공지방 일러스트) */
  thumbnailUrl?: string;
  /** 그룹 채팅방일 때만 이름 옆에 표시되는 멤버 수 */
  memberCount?: number;
  unreadCount?: number;
  isActive?: boolean;
  onClick?: () => void;
}

export const ChatRoomItem = ({
  name,
  lastMessage,
  timestamp,
  avatarUrl,
  thumbnailUrl,
  memberCount,
  unreadCount = 0,
  isActive = false,
  onClick,
}: ChatRoomItemProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex h-[76px] w-full gap-2.5 rounded-lg border bg-white px-4 py-3 text-left transition-colors',
        isActive ? 'border-primary-500' : 'border-gray-100 hover:bg-gray-50',
      )}
    >
      {thumbnailUrl ? (
        <div className="mt-px flex h-12 w-12 shrink-0 items-center justify-center self-center rounded-full bg-primary-200">
          <img src={thumbnailUrl} alt="" className="h-[38px] w-[38px]" />
        </div>
      ) : (
        <UserAvatar name={name} avatarUrl={avatarUrl} size="lg" className="mt-px h-12 w-12 shrink-0 self-center" />
      )}
      <div className="mt-2 flex min-w-0 flex-1 flex-col gap-0.5 self-start">
        <div className="flex items-center gap-1.5">
          <span
            className={cn(
              'truncate text-[14px] font-bold leading-[normal]',
              isActive ? 'text-primary-500' : 'text-gray-900',
            )}
          >
            {name}
          </span>
          {typeof memberCount === 'number' && (
            <span className="shrink-0 text-[12px] font-bold leading-[normal] text-gray-500">{memberCount}명</span>
          )}
        </div>
        <span className="truncate text-[12px] font-normal leading-[normal] text-gray-600">{lastMessage}</span>
      </div>
      <div className="mt-2 flex shrink-0 flex-col items-end gap-1 self-start">
        <span className="text-[10px] font-normal leading-[normal] text-gray-500">{timestamp}</span>
        {unreadCount > 0 && (
          <span className="flex h-4 min-w-4 items-center justify-center rounded-full bg-primary-700 px-[5px] text-[10px] text-white">
            {unreadCount}
          </span>
        )}
      </div>
    </button>
  );
};
