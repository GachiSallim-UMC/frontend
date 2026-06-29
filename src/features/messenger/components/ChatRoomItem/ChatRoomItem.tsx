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
      onClick={onClick}
      className={cn(
        'flex w-full items-start gap-3 rounded-lg px-3 py-3 text-left transition-colors',
        isActive ? 'bg-primary-200' : 'hover:bg-gray-100',
      )}
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-600 font-semibold text-sm">
        {name.charAt(0)}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-900">{name}</span>
          <span className="text-[10px] text-gray-400">{timestamp}</span>
        </div>
        <p className="mt-0.5 truncate text-xs text-gray-500">{lastMessage}</p>
      </div>
      {unreadCount > 0 && (
        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-red-700 px-1 text-[10px] text-white">
          {unreadCount}
        </span>
      )}
    </button>
  );
};
