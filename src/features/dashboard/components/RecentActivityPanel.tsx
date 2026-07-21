import { Panel, TimelineItem } from "@/shared/components";

interface Activity {
    id: string;
    actorName: string;
    description: string;
    timestamp: string;
}

export const RecentActivityPanel = ({activities}: {activities: Activity[] }) => {
    return (
        <Panel>
            <div>
                {activities.map((activity, index) => (
                    <TimelineItem
                        key={activity.id}
                        actorName={activity.actorName}
                        description={activity.description}
                        timestamp={activity.timestamp}
                        isFirst={index === 0}
                        isLast={index === activities.length - 1}
                    />
                ))}
            </div>
        </Panel>
    );
};