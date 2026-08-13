import { Button } from '@/shared/components';
import type { Group } from '@/features/member/types/member.types';
import { getResidenceLabel } from '@/features/member/constants/member.constants';
import { ResidenceTypeIcon } from '@/features/member/components/GroupSelect/ResidenceTypeIcon';

interface GroupCardProps {
  group: Group;
  onEnter: (groupId: string) => void;
}

/**
 * 모바일은 가로형(아이콘·정보·입장 버튼 한 줄, 높이 88px),
 * 데스크톱은 기존 세로형 카드를 유지합니다.
 */
export const GroupCard = ({ group, onEnter }: GroupCardProps) => {
  const handleEnter = () => {
    onEnter(group.id);
  };

  return (
    <div className="flex h-[88px] w-full items-center gap-3 rounded-[10px] border border-gray-100 bg-white px-4 lg:h-auto lg:flex-col lg:justify-center lg:gap-0 lg:rounded-lg lg:px-3 lg:pb-5 lg:pt-6">
      <ResidenceTypeIcon
        type={group.type}
        imageUrl={group.groupImage}
        alt={`${group.name} 프로필`}
        className="size-[60px] shrink-0 lg:mb-4 lg:size-[86px]"
      />

      <div className="flex min-w-0 flex-1 flex-col gap-px lg:flex-none lg:items-center lg:gap-0">
        <h2 className="truncate text-mobile-body font-bold text-gray-900 lg:text-button">
          {group.name}
        </h2>
        <p className="truncate text-mobile-caption text-gray-900 lg:mb-4 lg:text-xs">
          멤버 {group.memberCount}명 · {getResidenceLabel(group.type)}
        </p>
      </div>

      <Button
        variant="primary"
        size="sm"
        onClick={handleEnter}
        className="h-[38px] w-[68px] shrink-0 bg-primary-700 text-mobile-label font-bold hover:bg-primary-600 lg:h-8 lg:w-full lg:bg-primary-600 lg:text-sm lg:hover:bg-primary-700"
      >
        입장
      </Button>
    </div>
  );
};
