import HouseIcon from "@/assets/icons/member/house.svg?react"
import type { Group } from '@/features/member/types/member.types'

interface GroupPreviewCardProps {
  group: Group;
}

export const GroupPreviewCard = ({ group }: GroupPreviewCardProps) => {
    const getGroupTypeName = (type: string) => {
        switch (type) {
        case 'roommate':
            return '룸메이트';
        case 'share':
            return '쉐어하우스';
        case 'boarding':
            return '하숙/고시원'
        case 'family':
            return '가족'
        default:
            return 'etc';
        }
    };
    return (
        <div className="flex flex-col w-full">
            <label className="mb-2 text-base font-bold text-gray-900">
                그룹 정보 미리보기
            </label>
            <div className="flex flex-col items-center justify-center rounded-lg py-6 bg-primary-50 border border-gray-100">
                <HouseIcon className="mb-5 h-30 w-30" />
                <h1 className="mb-2 text-lg font-bold text-gray-800">
                    {group.name}
                </h1>
                <p className="mb-1 text-xs text-gray-900">
                    {group.memberCount}명 참여 중 / 최대 {group.maxMemberCount}명
                </p>
                <p className="text-xs text-gray-900">
                    거주 유형: {getGroupTypeName(group.type)}
                </p>
            </div>
        </div>
    );
};