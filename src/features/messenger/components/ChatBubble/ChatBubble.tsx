import type { ReactNode } from 'react';
import { UserAvatar } from '@/shared/components/ui/UserAvatar';
import { cn } from '@/shared/lib/cn';

interface ChatBubbleProps {
  senderName: string;
  senderAvatarUrl?: string;
  content: ReactNode;
  timestamp: string;
  isMine?: boolean;
}

export const ChatBubble = ({
  senderName,
  senderAvatarUrl,
  content,
  timestamp,
  isMine = false,
}: ChatBubbleProps) => {
  if (isMine) {
    return (
      <div className="flex justify-end">
        <div className="flex max-w-[70%] flex-col items-end gap-1">
          <div className="rounded-2xl rounded-tr-sm bg-primary-600 px-4 py-2.5 text-sm text-white">
            {content}
          </div>
          <span className="text-caption text-gray-500">{timestamp}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-2.5">
      <UserAvatar name={senderName} avatarUrl={senderAvatarUrl} size="sm" />
      <div className="flex max-w-[70%] flex-col gap-1">
        <span className="text-caption font-bold text-gray-900">{senderName}</span>
        <div
          className={cn(
            'rounded-2xl rounded-tl-sm border border-gray-200 bg-white px-4 py-2.5 text-sm text-gray-900',
          )}
        >
          {content}
        </div>
        <span className="text-[10px] text-gray-400">{timestamp}</span>
      </div>
    </div>
  );
};
