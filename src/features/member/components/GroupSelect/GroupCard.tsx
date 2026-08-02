import { Button } from '@/shared/components';
import type { Group } from '@/features/member/types/member.types';
import RoommateIcon from '@/assets/icons/member/ResidenceType/roommate.svg?react';
import ShareIcon from '@/assets/icons/member/ResidenceType/share.svg?react';
import FamilyIcon from '@/assets/icons/member/ResidenceType/family.svg?react';
import BoardingIcon from '@/assets/icons/member/ResidenceType/boarding.svg?react';
import EtcIcon from '@/assets/icons/member/ResidenceType/etc.svg?react';

interface GroupCardProps {
  group: Group;
  onEnter: (groupId: string) => void;
}

export const GroupCard = ({ group, onEnter }: GroupCardProps) => {
  const handleEnter = () => {
    onEnter(group.id);
  };

  const renderDefaultIcon = (type: string) => {
    switch (type) {
      case 'ROOMMATE':
        return <RoommateIcon />;
      case 'BOARDING':
        return <BoardingIcon />;
      case 'FAMILY':
        return <FamilyIcon />;
      case 'SHARE':
        return <ShareIcon />;
      default:
        return <EtcIcon />;
    }
  };

  return (
    <div className="flex flex-col items-center justify-center rounded-lg border border-gray-100 bg-white px-3 pt-6 pb-5">
      <div className="mb-4 h-[86px] w-[86px] shrink-0 items-center justify-center">
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
      <h1 className="font-button font-bold text-gray-900">{group.name}</h1>
      <p className="mb-4 text-xs text-gray-900">멤버 {group.memberCount}명</p>

      <Button variant="primary" size="sm" className="w-full font-bold" onClick={handleEnter}>
        입장
      </Button>
    </div>
  );
};
