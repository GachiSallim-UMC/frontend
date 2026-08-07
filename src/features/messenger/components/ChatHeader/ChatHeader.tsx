import { ChevronLeft, MoreVertical } from 'lucide-react';
import { ConnectionStatusBadge } from '@/features/messenger/components/ConnectionStatusBadge';

interface ChatHeaderProps {
  roomName: string;
  memberCount: number;
  onlineMembers?: string[];
  isConnected?: boolean;
  onOpenManage?: () => void;
  /** 모바일 전용: 뒤로가기(채팅방 목록으로) */
  onBack?: () => void;
}

export const ChatHeader = ({
  roomName,
  memberCount,
  onlineMembers = [],
  isConnected = true,
  onOpenManage,
  onBack,
}: ChatHeaderProps) => {
  return (
    <div className="grid h-[52px] shrink-0 grid-cols-[1fr_auto_1fr] items-center border-b border-gray-100 bg-white px-4 lg:flex lg:h-[72px] lg:justify-between lg:gap-5 lg:px-6">
      <div className="justify-self-start lg:hidden">
        <button
          type="button"
          onClick={onBack}
          aria-label="채팅방 목록으로"
          className="flex size-8 items-center justify-start text-gray-900"
        >
          <ChevronLeft className="size-6" strokeWidth={1.5} />
        </button>
      </div>
      <h2 className="max-w-[180px] truncate text-center text-mobile-title font-bold tracking-[0.04em] text-gray-900 lg:hidden">
        {roomName}
      </h2>
      <div className="flex items-center justify-self-end gap-1.5 lg:hidden">
        <span className="flex shrink-0 items-center gap-1.5 rounded-full bg-white px-2.5 py-1 text-[11px] font-medium leading-[normal] text-gray-600 shadow-card">
          <span className={isConnected ? 'text-green-500' : 'text-gray-400'}>●</span>
          WS
        </span>
        <button
          type="button"
          onClick={onOpenManage}
          aria-label="채팅방 관리"
          className="shrink-0 text-gray-500"
        >
          <MoreVertical className="size-5" />
        </button>
      </div>

      <div className="hidden min-w-0 items-center gap-5 lg:flex">
        <h2 className="whitespace-nowrap text-[20px] font-semibold leading-[normal] text-gray-900">
          {roomName} · 멤버 {memberCount}명
        </h2>
        {onlineMembers.length > 0 && (
          <p className="whitespace-nowrap text-[12px] font-normal leading-[normal] text-gray-500">
            ● 온라인: {onlineMembers.join(', ')}
          </p>
        )}
      </div>
      <div className="hidden shrink-0 items-center gap-4 lg:flex">
        <ConnectionStatusBadge isConnected={isConnected} />
        <button
          type="button"
          onClick={onOpenManage}
          aria-label="채팅방 관리"
          className="text-gray-500 transition-colors hover:text-gray-700"
        >
          <MoreVertical className="h-6 w-6" />
        </button>
      </div>
    </div>
  );
};
