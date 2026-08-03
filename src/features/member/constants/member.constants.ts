import type { ResidenceType } from '../types/member.types';

export const RESIDENCE_OPTIONS: { value: ResidenceType; label: string }[] = [
  { label: '룸메이트', value: 'ROOMMATE' },
  { label: '쉐어하우스', value: 'SHARE' },
  { label: '하숙·고시원', value: 'BOARDING' },
  { label: '가족', value: 'FAMILY' },
  { label: '기타', value: 'ETC' },
];
