import { UserAvatar } from '@/shared/components/ui/UserAvatar';
import { ShareCard } from '@/features/messenger/components/ShareCard';
import { cn } from '@/shared/lib/cn';
import type { ChatMessage, ChatShareCard } from '@/features/messenger/types';

interface ChatBubbleProps {
  senderName: string;
  senderAvatarUrl?: string;
  timestamp: string;
  isMine?: boolean;
  items: ChatMessage[];
  onViewShareDetail?: (shareCard: ChatShareCard) => void;
}

export const ChatBubble = ({
  senderName,
  senderAvatarUrl,
  timestamp,
  isMine = false,
  items,
  onViewShareDetail,
}: ChatBubbleProps) => {
  return (
    <div className={cn('flex w-full items-end gap-3', isMine && 'flex-row-reverse')}>
      <div className={cn('flex items-start gap-2.5', isMine && 'flex-row-reverse')}>
        <UserAvatar name={senderName} avatarUrl={senderAvatarUrl} size="lg" className="h-11 w-11 shrink-0" />
        <div className={cn('flex flex-col gap-2', isMine ? 'items-end' : 'items-start')}>
          <span className="text-[16px] font-bold leading-[normal] text-gray-900">{senderName}</span>
          {items.map(item => {
            const { shareCard } = item;
            return shareCard ? (
              <ShareCard key={item.id} {...shareCard} onViewDetail={() => onViewShareDetail?.(shareCard)} />
            ) : (
              <div
                key={item.id}
                className={cn(
                  'flex h-12 max-w-[420px] items-center rounded-[10px] border border-gray-100 bg-white px-4 text-[16px] font-normal leading-[normal] text-gray-900',
                  isMine && 'justify-end text-right',
                )}
              >
                {item.content}
              </div>
            );
          })}
        </div>
      </div>
      <span className="shrink-0 pb-1 text-[14px] font-normal leading-[normal] text-gray-500">{timestamp}</span>
    </div>
  );
};
