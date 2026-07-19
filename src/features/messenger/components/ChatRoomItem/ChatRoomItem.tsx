import { cn } from '@/shared/lib/cn';

interface ChatRoomItemProps {
  name: string;
  lastMessage: string;
  timestamp: string;
  unreadCount?: number;
  isActive?: boolean;
  onClick?: () => void;
}

export const ChatRoomItem = ({
  name,
  lastMessage,
  timestamp,
  unreadCount = 0,
  isActive = false,
  onClick,
}: ChatRoomItemProps) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'relative flex h-20 w-full flex-col items-start gap-1.5 border-b border-gray-100 py-[18px] pl-[25px] pr-4 text-left transition-colors',
        isActive ? 'bg-primary-200' : 'hover:bg-gray-50',
      )}
    >
      {isActive && <span className="absolute left-0 top-0 h-full w-[3px] bg-primary-700" />}
      <div className="flex items-end gap-2.5">
        <span
          className={cn(
            'text-[18px] font-semibold leading-[normal]',
            isActive ? 'text-primary-700' : 'text-gray-900',
          )}
        >
          {name}
        </span>
        {unreadCount > 0 && (
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gray-500 text-xs text-white">
            {unreadCount}
          </span>
        )}
      </div>
      <div className="flex w-full items-end justify-between gap-2">
        <span className="truncate text-[14px] font-normal leading-[normal] text-gray-900">{lastMessage}</span>
        <span className="shrink-0 text-right text-[12px] font-normal leading-[normal] text-gray-500">
          {timestamp}
        </span>
      </div>
    </button>
  );
};
