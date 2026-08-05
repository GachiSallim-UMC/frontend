import { useState } from 'react';
import { useStartDayStore } from '@/shared/store';

const DAY_LABELS = ['일', '월', '화', '수', '목', '금', '토'];

/**날짜 변경 훅 */
export const useWeekCalendar = () => {
  const startDay = useStartDayStore(state => state.startDay);
  const [currentDate, setCurrentDate] = useState(new Date());

  const handlePrevWeek = () => {
    const prev = new Date(currentDate);
    prev.setDate(prev.getDate() - 7);
    setCurrentDate(prev);
  };

  const handleNextWeek = () => {
    const next = new Date(currentDate);
    next.setDate(next.getDate() + 7);
    setCurrentDate(next);
  };

  // 마이페이지 "주 시작 요일" 설정(일요일=0 / 월요일=1)에 맞춰 주의 첫날을 계산
  const weekStartOffset = startDay === 'monday' ? 1 : 0;

  const startOfWeek = new Date(currentDate);
  const diffFromWeekStart = (startOfWeek.getDay() - weekStartOffset + 7) % 7;
  startOfWeek.setDate(startOfWeek.getDate() - diffFromWeekStart);

  const weekDates = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(startOfWeek);
    date.setDate(date.getDate() + index);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const dayDate = String(date.getDate()).padStart(2, '0');
    return `${month}.${dayDate}`;
  });

  const dayLabels = Array.from(
    { length: 7 },
    (_, index) => DAY_LABELS[(weekStartOffset + index) % 7],
  );

  const today = new Date();
  today.setHours(0, 0, 0, 0); // 자정(00:00:00) 기준으로 맞춤
  const todayString = `${String(today.getMonth() + 1).padStart(2, '0')}.${String(today.getDate()).padStart(2, '0')}`;

  return { currentDate, weekDates, dayLabels, handlePrevWeek, handleNextWeek, today, todayString };
};
