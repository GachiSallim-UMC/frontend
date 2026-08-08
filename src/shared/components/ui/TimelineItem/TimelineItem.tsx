import { UserAvatar } from '@/shared/components';
import { cn, formatRelativeTime, renderTimelineText } from '@/shared/lib';

interface TimelineItemProps {
  actorName: string;
  actorAvatarUrl?: string;
  description: string;
  timestamp: string;
  isFirst?: boolean;
  isLast?: boolean;
}

export const TimelineItem = ({
  actorName,
  actorAvatarUrl,
  description,
  timestamp,
  isFirst = false,
  isLast = false,
}: TimelineItemProps) => {
  return (
    <div className={cn('flex items-stretch gap-4')}>
      <div className="flex w-3 shrink-0 flex-col items-center">
        <div className={cn('w-px flex-1', isFirst ? 'invisible' : 'bg-primary-400')} />
        <span
          className={cn(
            'z-10 h-3 w-3 shrink-0 rounded-full border border-primary-400',
            isFirst ? 'bg-primary-500' : 'bg-white',
          )}
        />
        <div className={cn('w-px flex-1', isLast ? 'invisible' : 'bg-primary-400')} />
      </div>

      <div className="flex flex-1 items-center gap-4">
        <p className="w-20 shrink-0 text-caption text-gray-400">{formatRelativeTime(timestamp)}</p>
        <div
          className={cn(
            'flex flex-1 items-center gap-4',
            !isFirst && 'pt-5',
            !isLast && 'pb-5 border-b border-gray-100',
          )}
        >
          <UserAvatar name={actorName} avatarUrl={actorAvatarUrl} size="lg" />
          <p className="min-w-0 flex-1 text-body text-gray-900">
            {renderTimelineText(actorName, description)}
          </p>
        </div>
      </div>
    </div>
  );
};