import { Panel, TimelineItem, UserAvatar } from "@/shared/components";
import { cn, renderTimelineText } from "@/shared/lib";
import type { DashboardActivityDto } from '@/features/dashboard/types/dashboard.types'

interface RecentActivityPanelProps {
  activities: DashboardActivityDto[];
}

const getRelativeTime = (dateString: string) => {
    const past = new Date(dateString);
    const now = new Date();
    
    const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);
    
    if (diffInSeconds < 0) return '방금 전';

    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    const diffInMonths = Math.floor(diffInDays / 30);
    const diffInYears = Math.floor(diffInDays / 365);

    if (diffInSeconds < 60) {
        return '방금 전';
    } else if (diffInMinutes < 60) {
        return `${diffInMinutes}분 전`;
    } else if (diffInHours < 24) {
        return `${diffInHours}시간 전`;
    } else if (diffInDays < 30) {
        return `${diffInDays}일 전`;
    } else if (diffInDays < 365) {
        return `${diffInMonths}개월 전`;
    } else {
        return `${diffInYears}년 전`;
    }
};

export const RecentActivityPanel = ({ activities }: RecentActivityPanelProps) => {
    if (activities.length === 0) {
        return (
            <Panel>
                <p className="text-sm text-gray-500 pb-5">최근 활동 내역이 없습니다.</p>
            </Panel>
        );
    }

    return (
        <>
            {/* 모바일: 아바타 + 2줄 텍스트 목록 */}
            <Panel className="p-0 lg:hidden">
                <ul className="flex flex-col">
                    {activities.map((activity, index) => (
                        <li
                            key={activity.activityId}
                            className={cn(
                                'flex items-center gap-2 px-4 py-[13px]',
                                index !== activities.length - 1 && 'border-b border-gray-100',
                            )}
                        >
                            <UserAvatar
                                name={activity.actorName}
                                avatarUrl={activity.actorProfileImage ?? undefined}
                                size="sm"
                                className="shrink-0"
                            />
                            <div className="min-w-0 flex-1">
                                <p className="truncate text-mobile-label text-gray-900">
                                    {renderTimelineText(activity.actorName, activity.message)}
                                </p>
                                <p className="mt-0.5 text-mobile-caption text-gray-600">
                                    {getRelativeTime(activity.createdAt)}
                                </p>
                            </div>
                        </li>
                    ))}
                </ul>
            </Panel>

            {/* 데스크톱: 타임라인 */}
            <Panel className="hidden lg:block">
                <div>
                    {activities.map((activity, index) => (
                        <TimelineItem
                            key={activity.activityId}
                            actorName={activity.actorName}
                            actorAvatarUrl={activity.actorProfileImage ?? undefined}
                            description={activity.message}
                            timestamp={getRelativeTime(activity.createdAt)}
                            isFirst={index === 0}
                            isLast={index === activities.length - 1}
                        />
                    ))}
                </div>
            </Panel>
        </>
    );
};