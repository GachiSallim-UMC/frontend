import { UserAvatar } from '@/shared/components/ui/UserAvatar';

interface TimelineItemProps {
  actorName: string;
  actorAvatarUrl?: string;
  description: string;
  timestamp: string;
  isLast?: boolean;
}

export const TimelineItem = ({
  actorName,
  actorAvatarUrl,
  description,
  timestamp,
  isLast = false,
}: TimelineItemProps) => {
  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center">
        <UserAvatar name={actorName} avatarUrl={actorAvatarUrl} size="sm" />
        {!isLast && <div className="mt-1 flex-1 w-px bg-gray-100" />}
      </div>
      <div className="pb-4 min-w-0">
        <p className="text-caption text-gray-500">{timestamp}</p>
        <p className="mt-0.5 text-caption text-gray-900">{description}</p>
      </div>
    </div>
  );
};
