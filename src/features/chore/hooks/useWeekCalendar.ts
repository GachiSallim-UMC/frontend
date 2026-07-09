import { useState } from 'react';

/**날짜 변경 훅 */
export const useWeekCalendar = () => {
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

  const startOfWeek = new Date(currentDate);
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());

  const weekDates = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(startOfWeek);
    date.setDate(date.getDate() + index);
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const dayDate = String(date.getDate()).padStart(2, '0');
    return `${month}.${dayDate}`;
  });
  return { currentDate, weekDates, handlePrevWeek, handleNextWeek };
};
