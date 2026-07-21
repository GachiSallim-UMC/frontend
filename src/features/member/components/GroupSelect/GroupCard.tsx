import { Button } from "@/shared/components";
import type { Group } from "@/features/member/types/member.types";
import HouseIcon from "@/assets/icons/member/house.svg?react"
import SchoolIcon from "@/assets/icons/member/school.svg?react"


interface GroupCardProps {
    group: Group;
    onEnter: (groupId: string) => void;
}

export const GroupCard = ({ group, onEnter }: GroupCardProps) => {
    const handleEnter = () => {
        onEnter(group.id);
    };

    return (
        <div className="flex flex-col items-center justify-center rounded-lg border border-gray-100 bg-white px-3 pt-6 pb-5">
                <div className="mb-4 h-21 w-21">
                    {group.type === "roommate" ? (
                        <HouseIcon />
                        ) : (
                            <SchoolIcon />
                    )}
                </div>
                <h1 className="font-button font-bold text-gray-900">{group.name}</h1>
                <p className="mb-4 text-xs text-gray-900">멤버 {group.memberCount}명</p>

                <Button
                    variant="primary"
                    size="sm"
                    className="w-full font-bold"
                    onClick={handleEnter}
                >
                    입장
                </Button>
            </div>
    );
};