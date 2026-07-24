import type { ActivityLog, ActivityLogGroup } from '../types/activity.type';

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

export const toDateKey = (isoDate: string) => isoDate.slice(0, 10);

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
