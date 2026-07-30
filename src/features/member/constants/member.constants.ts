import type { ResidenceType } from '../types/member.types';

export const RESIDENCE_OPTIONS: { value: ResidenceType; label: string }[] = [
  { label: '룸메이트', value: 'roommate' },
  { label: '쉐어하우스', value: 'share' },
  { label: '하숙·고시원', value: 'boarding' },
  { label: '가족', value: 'family' },
  { label: '기타', value: 'etc' },
];
