import type { ResidenceType } from '@/features/member/types/member.types';

export const RESIDENCE_OPTIONS: { value: ResidenceType; label: string }[] = [
  { label: '룸메이트', value: 'ROOMMATE' },
  { label: '쉐어하우스', value: 'SHARE' },
  { label: '하숙·고시원', value: 'BOARDING' },
  { label: '가족', value: 'FAMILY' },
  { label: '기타', value: 'ETC' },
];

export const MIN_GROUP_MEMBER_COUNT = 2;
export const MAX_GROUP_MEMBER_COUNT = 20;

/** 그룹 생성·설정에서 공통으로 사용하는 최대 인원 선택지입니다. */
export const GROUP_MEMBER_COUNT_OPTIONS = Array.from(
  { length: MAX_GROUP_MEMBER_COUNT - MIN_GROUP_MEMBER_COUNT + 1 },
  (_, index) => {
    const count = index + MIN_GROUP_MEMBER_COUNT;
    return { value: String(count), label: `${count}명` };
  },
);

export const GROUP_MEMBER_COUNT_ERROR_MESSAGE =
  `최대 인원은 ${MIN_GROUP_MEMBER_COUNT}명부터 ${MAX_GROUP_MEMBER_COUNT}명까지 선택해 주세요.`;

export const isValidGroupMemberCount = (value: number) =>
  Number.isInteger(value) &&
  value >= MIN_GROUP_MEMBER_COUNT &&
  value <= MAX_GROUP_MEMBER_COUNT;

/** 거주 유형 한글 라벨. 목록·미리보기 등에서 공통으로 사용합니다. */
export const getResidenceLabel = (type: ResidenceType | '') =>
  RESIDENCE_OPTIONS.find(option => option.value === type)?.label ?? '기타';
