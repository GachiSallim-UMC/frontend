import type { Group } from '@/features/member/types/member.types';
import { getResidenceLabel } from '@/features/member/constants/member.constants';
import { ResidenceTypeIcon } from '@/features/member/components/GroupSelect/ResidenceTypeIcon';

interface GroupPreviewCardProps {
  group: Group;
}

export const GroupPreviewCard = ({ group }: GroupPreviewCardProps) => (
  <div className="flex w-full flex-col gap-2">
    <span className="text-mobile-body font-bold text-gray-700 lg:text-base lg:text-gray-900">
      그룹 정보 미리보기
    </span>

    <div className="flex flex-col items-center justify-center rounded-lg border border-gray-100 bg-primary-50 px-4 py-6">
      <ResidenceTypeIcon
        type={group.type}
        imageUrl={group.groupImage}
        alt={`${group.name} 프로필`}
        className="size-24 shrink-0 lg:size-[120px]"
      />

      <h2 className="mt-4 text-base font-bold text-gray-900 lg:text-lg lg:text-gray-800">
        {group.name}
      </h2>

      <div className="mt-1.5 flex flex-col items-center gap-1 text-mobile-label text-gray-900 lg:text-xs">
        <p>
          {group.memberCount}명 참여 중 / 최대 {group.maxMemberCount}명
        </p>
        <p>거주 유형: {getResidenceLabel(group.type)}</p>
      </div>
    </div>
  </div>
);
