import type { ActivityLog, ActivityLogGroup } from '@/features/activity/types/activity.type';

export const isWithinDays = (isoDate: string, days: number) => {
  const diffDays = (Date.now() - new Date(isoDate).getTime()) / (1000 * 60 * 60 * 24);
  return diffDays >= 0 && diffDays < days;
};

export const matchesPeriod = (isoDate: string, period: string) => {
  if (period === '1일') return isWithinDays(isoDate, 1);
  if (period === '1주일') return isWithinDays(isoDate, 7);
  if (period === '1달') return isWithinDays(isoDate, 31);
  return true; // '전체'
};

const KST_TIME_ZONE = 'Asia/Seoul';

/** en-CA 로케일은 YYYY-MM-DD 순서로 포맷해줘서 날짜 키 추출에 그대로 사용 */
const KST_DATE_FORMATTER = new Intl.DateTimeFormat('en-CA', {
  timeZone: KST_TIME_ZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
});

/** createdAt(UTC)을 KST 달력 기준 날짜(YYYY-MM-DD)로 변환 — 기기 타임존 설정과 무관하게 항상 KST 고정 */
export const toDateKey = (isoDate: string) => KST_DATE_FORMATTER.format(new Date(isoDate));

export const toDateLabel = (isoDate: string) => {
  const dateKey = toDateKey(isoDate);
  const todayKey = toDateKey(new Date().toISOString());
  const diffDays = Math.round(
    (new Date(todayKey).getTime() - new Date(dateKey).getTime()) / (1000 * 60 * 60 * 24),
  );
  const formatted = dateKey.split('-').join('.');

  if (diffDays === 0) return `${formatted} (오늘)`;
  if (diffDays === 1) return `${formatted} (어제)`;
  return formatted;
};

export const toTimeLabel = (isoDate: string) =>
  new Date(isoDate).toLocaleTimeString('ko-KR', { hour: 'numeric', minute: '2-digit' });

export const groupByDate = (logs: ActivityLog[]): ActivityLogGroup[] => {
  const groups: ActivityLogGroup[] = [];
  logs.forEach(log => {
    const dateKey = toDateKey(log.createdAt);
    const lastGroup = groups[groups.length - 1];
    if (lastGroup && lastGroup.date === dateKey) {
      lastGroup.logs.push(log);
    } else {
      groups.push({ date: dateKey, dateLabel: toDateLabel(log.createdAt), logs: [log] });
    }
  });
  return groups;
};
