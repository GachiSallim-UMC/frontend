import RoommateIcon from '@/assets/icons/member/ResidenceType/roommate.svg?react';
import ShareIcon from '@/assets/icons/member/ResidenceType/share.svg?react';
import FamilyIcon from '@/assets/icons/member/ResidenceType/family.svg?react';
import BoardingIcon from '@/assets/icons/member/ResidenceType/boarding.svg?react';
import EtcIcon from '@/assets/icons/member/ResidenceType/etc.svg?react';
import { cn } from '@/shared/lib';
import type { ResidenceType } from '@/features/member/types/member.types';

const ICON_BY_TYPE = {
  ROOMMATE: RoommateIcon,
  SHARE: ShareIcon,
  BOARDING: BoardingIcon,
  FAMILY: FamilyIcon,
  ETC: EtcIcon,
} as const;

interface ResidenceTypeIconProps {
  type: ResidenceType | '';
  /** 그룹 프로필 이미지가 있으면 아이콘 대신 이 이미지를 보여줍니다. */
  imageUrl?: string | null;
  alt?: string;
  className?: string;
}

/** 거주 유형별 기본 아이콘. 그룹 이미지가 있으면 이미지를 우선합니다. */
export const ResidenceTypeIcon = ({
  type,
  imageUrl,
  alt = '그룹 프로필',
  className,
}: ResidenceTypeIconProps) => {
  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={alt}
        className={cn('rounded-full object-cover', className)}
      />
    );
  }

  const Icon = ICON_BY_TYPE[type as keyof typeof ICON_BY_TYPE] ?? EtcIcon;
  return <Icon className={className} />;
};
