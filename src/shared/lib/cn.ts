import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

/**
 * 커스텀 fontSize 토큰을 tailwind-merge에 등록.
 * 이걸 안 하면 `text-caption` 같은 토큰을 색상 클래스로 오인해
 * `text-gray-900` 등과 충돌 시 제거해버린다.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [{ text: ['caption', 'button', 'body', 'group-title', 'key-number'] }],
    },
  },
});

/** Tailwind 클래스 병합 유틸 — clsx + twMerge 조합 */
export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));
