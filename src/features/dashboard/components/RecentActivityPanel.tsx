import { Panel, TimelineItem } from "@/shared/components";
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
    } else if (diffInMonths < 12) {
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
        <Panel>
            <div>
                {activities.map((activity, index) => (
                    <TimelineItem
                        key={activity.activityId}
                        actorName={activity.actorName}
                        description={activity.message}
                        timestamp={getRelativeTime(activity.createdAt)}
                        isFirst={index === 0}
                        isLast={index === activities.length - 1}
                    />
                ))}
            </div>
        </Panel>
    );
};