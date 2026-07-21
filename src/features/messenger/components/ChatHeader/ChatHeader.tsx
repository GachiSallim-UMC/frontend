import { ConnectionStatusBadge } from '@/features/messenger/components/ConnectionStatusBadge';

interface ChatHeaderProps {
  roomName: string;
  memberCount: number;
  onlineMembers?: string[];
  isConnected?: boolean;
}

export const ChatHeader = ({ roomName, memberCount, onlineMembers = [], isConnected = true }: ChatHeaderProps) => {
  return (
    <div className="flex h-[72px] shrink-0 items-center justify-between gap-5 border-b border-gray-100 bg-white px-6">
      <div className="flex min-w-0 items-center gap-5">
        <h2 className="whitespace-nowrap text-[20px] font-semibold leading-[normal] text-gray-900">
          {roomName} · 멤버 {memberCount}명
        </h2>
        {onlineMembers.length > 0 && (
          <p className="whitespace-nowrap text-[12px] font-normal leading-[normal] text-gray-500">
            ● 온라인: {onlineMembers.join(', ')}
          </p>
        )}
      </div>
      <ConnectionStatusBadge isConnected={isConnected} />
    </div>
  );
};
