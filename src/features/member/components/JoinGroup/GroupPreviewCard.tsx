import type { Group } from '@/features/member/types/member.types';

import RoommateIcon from '@/assets/icons/member/ResidenceType/roommate.svg?react';
import ShareIcon from '@/assets/icons/member/ResidenceType/share.svg?react';
import FamilyIcon from '@/assets/icons/member/ResidenceType/family.svg?react';
import BoardingIcon from '@/assets/icons/member/ResidenceType/boarding.svg?react';
import EtcIcon from '@/assets/icons/member/ResidenceType/etc.svg?react';

interface GroupPreviewCardProps {
  group: Group;
}

export const GroupPreviewCard = ({ group }: GroupPreviewCardProps) => {
  const getGroupTypeName = (type: string) => {
    switch (type) {
      case 'ROOMMATE':
        return '룸메이트';
      case 'SHARE':
        return '쉐어하우스';
      case 'BOARDING':
        return '하숙/고시원';
      case 'FAMILY':
        return '가족';
      default:
        return '기타';
    }
  };
  const renderDefaultIcon = (type: string) => {
    switch (type) {
      case 'ROOMMATE':
        return <RoommateIcon className="h-full w-full" />;
      case 'BOARDING':
        return <BoardingIcon className="h-full w-full" />;
      case 'FAMILY':
        return <FamilyIcon className="h-full w-full" />;
      case 'SHARE':
        return <ShareIcon className="h-full w-full" />;
      default:
        return <EtcIcon className="h-full w-full" />;
    }
  };
  return (
    <div className="flex flex-col w-full">
      <label className="mb-2 text-base font-bold text-gray-900">그룹 정보 미리보기</label>
      <div className="flex flex-col items-center justify-center rounded-lg py-6 bg-primary-50 border border-gray-100">
        <div className="mb-5 flex h-[120px] w-[120px] shrink-0 items-center justify-center">
          {group.groupImage ? (
            <img
              src={group.groupImage}
              alt={`${group.name} 프로필`}
              className="h-full w-full rounded-full object-cover shadow-sm"
            />
          ) : (
            renderDefaultIcon(group.type)
          )}
        </div>
        <h1 className="mb-2 text-lg font-bold text-gray-800">{group.name}</h1>
        <p className="mb-1 text-xs text-gray-900">
          {group.memberCount}명 참여 중 / 최대 {group.maxMemberCount}명
        </p>
        <p className="text-xs text-gray-900">거주 유형: {getGroupTypeName(group.type)}</p>
      </div>
    </div>
  );
};
