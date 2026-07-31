import { UserAvatar } from '@/shared/components/ui/UserAvatar';
import { ShareCard } from '@/features/messenger/components/ShareCard';
import { cn } from '@/shared/lib/cn';
import type { ChatMessage } from '@/features/messenger/types';

interface ChatBubbleProps {
  senderName: string;
  senderAvatarUrl?: string;
  isMine?: boolean;
  items: ChatMessage[];
  onViewShareDetail?: (message: ChatMessage) => void;
  onShareAction?: (message: ChatMessage) => void;
  /** 공유 카드 액션 버튼 처리 중인 메시지 id 목록 (연타 방지용 disabled 처리) */
  pendingShareActionIds?: Set<string>;
}

export const ChatBubble = ({
  senderName,
  senderAvatarUrl,
  isMine = false,
  items,
  onViewShareDetail,
  onShareAction,
  pendingShareActionIds,
}: ChatBubbleProps) => {
  return (
    <div className={cn('flex w-full max-w-[50%] min-w-0 items-start gap-2.5', isMine && 'ml-auto flex-row-reverse')}>
      <UserAvatar name={senderName} avatarUrl={senderAvatarUrl} size="lg" className="h-11 w-11 shrink-0" />
      <div className={cn('flex min-w-0 flex-col gap-2', isMine ? 'items-end' : 'items-start')}>
        <span className="text-[16px] font-bold leading-[normal] text-gray-900">{senderName}</span>
        {items.map((item, index) => {
          const { shareCard } = item;
          // 카카오톡처럼 같은 시각(분)에 연속으로 보낸 메시지는 맨 마지막 말풍선에만 시간을 보여준다.
          const showTimestamp = items[index + 1]?.timestamp !== item.timestamp;

          return (
            <div key={item.id} className={cn('flex min-w-0 items-end gap-3', isMine && 'flex-row-reverse')}>
              {shareCard ? (
                <ShareCard
                  {...shareCard}
                  onViewDetail={() => onViewShareDetail?.(item)}
                  onAction={() => onShareAction?.(item)}
                  isActionPending={pendingShareActionIds?.has(item.id)}
                />
              ) : (
                <div
                  className={cn(
                    'min-h-12 max-w-[420px] min-w-0 whitespace-pre-wrap break-words rounded-[10px] border border-gray-100 bg-white px-4 py-3 text-[16px] font-normal leading-[normal] text-gray-900',
                    isMine && 'text-right',
                  )}
                >
                  {item.content}
                </div>
              )}
              {showTimestamp && (
                <span className="shrink-0 pb-1 text-[14px] font-normal leading-[normal] text-gray-500">
                  {item.timestamp}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
