const DATE_ONLY_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;

/**
 * 닉네임 허용 문자 규칙. 백엔드 update-profile DTO 제약과 동일하게 맞춥니다.
 * 회원가입·프로필 수정이 같은 규칙을 쓰도록 한 곳에서 관리합니다.
 */
export const NICKNAME_PATTERN = /^[가-힣a-zA-Z0-9]+$/;
export const NICKNAME_PATTERN_MESSAGE = '닉네임은 한글·영문·숫자만 사용할 수 있습니다.';

export const isUnsignedIntegerInput = (value: string) => /^\d*$/.test(value);

export const isValidDateOnly = (value: string) => {
  const match = DATE_ONLY_PATTERN.exec(value);
  if (!match) return false;

  const [, yearValue, monthValue, dayValue] = match;
  const year = Number(yearValue);
  const month = Number(monthValue);
  const day = Number(dayValue);
  const date = new Date(Date.UTC(year, month - 1, day));

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
};
