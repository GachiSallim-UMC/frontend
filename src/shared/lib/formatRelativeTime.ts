/** Date를 "방금 전", "N분 전", "N시간 전", "N일 전", 7일 이상이면 "YYYY.MM.DD"로 변환 */
export const formatRelativeTime = (raw: string, now: Date = new Date()): string => {
  const match = raw.match(/^(오늘|어제|(\d+)일 전)\s+(\d{2}):(\d{2})$/);
  if (!match) return raw; // 패턴이 안 맞으면 원본 그대로 표시

  const [, dayLabel, daysAgoStr, hh, mm] = match;
  const daysAgo = dayLabel === '오늘' ? 0 : dayLabel === '어제' ? 1 : Number(daysAgoStr);

  const target = new Date(now);
  target.setDate(target.getDate() - daysAgo);
  target.setHours(Number(hh), Number(mm), 0, 0);

  const diffMs = now.getTime() - target.getTime();
  const diffMin = Math.floor(diffMs / (60 * 1000));
  const diffHour = Math.floor(diffMs / (60 * 60 * 1000));
  const diffDay = Math.floor(diffMs / (24 * 60 * 60 * 1000));

  if (diffMin < 1) return '방금 전';
  if (diffMin < 60) return `${diffMin}분 전`;
  if (diffHour < 24) return `${diffHour}시간 전`;
  return `${diffDay}일 전`;
};