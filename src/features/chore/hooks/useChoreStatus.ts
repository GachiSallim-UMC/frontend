import type { Chore } from '../types/chore.types';

// 기준일 구하기
export const getChoreTargetDateStr = (chore: Chore) => {
  if (chore.repeatType !== 'once') {
    return chore.startDate;
  }
  return chore.endDate ?? chore.startDate;
};

// 프론트엔드 UI용 상태(완료/미완료/예정) 구하기
export const getChoreUIStatus = (chore: Chore): 'done' | 'pending' | 'scheduled' => {
  const status = String(chore.status).toUpperCase();
  if (status === 'DONE') return 'done';

  const targetDateStr = getChoreTargetDateStr(chore);
  const targetDate = new Date(targetDateStr);
  targetDate.setHours(0, 0, 0, 0);

  const todayDate = new Date();
  todayDate.setHours(0, 0, 0, 0);

  return targetDate.getTime() <= todayDate.getTime() ? 'pending' : 'scheduled';
};
