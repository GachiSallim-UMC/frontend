import { useDateFormatStore } from '@/shared/store/useDateFormatStore';
import type { DateFormatValue } from '@/shared/types/common';

const pad2 = (n: number) => String(n).padStart(2, '0');

const formatDateByPattern = (date: Date, format: DateFormatValue): string => {
  const yyyy = date.getFullYear();
  const yy = pad2(yyyy % 100);
  const mm = pad2(date.getMonth() + 1);
  const dd = pad2(date.getDate());

  return format === 'DD/MM/YY' ? `${dd}/${mm}/${yy}` : `${yyyy}/${mm}/${dd}`;
};

/**
 * 마이페이지 > 시스템 설정 > 날짜 형식(전역 설정)을 반영해 날짜를 포맷합니다.
 * React 컴포넌트 밖(매퍼, 훅 등)에서 호출할 때는 format을 생략하면 현재 전역 설정을 그대로 사용합니다.
 * 유효하지 않은 날짜가 들어오면 원본 문자열을 그대로 반환합니다.
 */
export const formatDate = (value: string | Date, format?: DateFormatValue): string => {
  const date = typeof value === 'string' ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) {
    return typeof value === 'string' ? value : '';
  }

  const resolvedFormat = format ?? useDateFormatStore.getState().dateFormat;
  return formatDateByPattern(date, resolvedFormat);
};

/** 컴포넌트 안에서 전역 날짜 형식이 바뀔 때 즉시 리렌더링되도록 구독하는 훅 */
export const useDateFormat = () => useDateFormatStore(state => state.dateFormat);
