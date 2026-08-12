import type { ResidenceType } from '@/features/member/types/member.types';

export const RESIDENCE_OPTIONS: { value: ResidenceType; label: string }[] = [
  { label: '룸메이트', value: 'ROOMMATE' },
  { label: '쉐어하우스', value: 'SHARE' },
  { label: '하숙·고시원', value: 'BOARDING' },
  { label: '가족', value: 'FAMILY' },
  { label: '기타', value: 'ETC' },
];

/** 거주 유형 한글 라벨. 목록·미리보기 등에서 공통으로 사용합니다. */
export const getResidenceLabel = (type: ResidenceType | '') =>
  RESIDENCE_OPTIONS.find(option => option.value === type)?.label ?? '기타';
