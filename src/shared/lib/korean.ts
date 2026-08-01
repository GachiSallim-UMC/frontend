const HANGUL_BASE = 0xac00;
const HANGUL_LAST = 0xd7a3;

/** 한글 단어 마지막 글자의 받침 유무 (한글이 아니면 받침 없음으로 취급) */
const hasBatchim = (word: string): boolean => {
  const lastChar = word.trim().slice(-1);
  if (!lastChar) return false;
  const code = lastChar.charCodeAt(0);
  if (code < HANGUL_BASE || code > HANGUL_LAST) return false;
  return (code - HANGUL_BASE) % 28 !== 0;
};

/** 받침 유무에 따라 조사를 선택 (예: josa('마트 장보기', '이', '가') → '가') */
export const josa = (word: string, withBatchim: string, withoutBatchim: string): string =>
  hasBatchim(word) ? withBatchim : withoutBatchim;
