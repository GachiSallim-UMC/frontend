import { ChevronLeft, ChevronRight, Circle } from 'lucide-react';
import { useWeekCalendar } from '../hooks/useWeekCalendar';
import type { Chore } from '../types/chore.types';

const STATUS_COLORS = {
  done: 'text-green-700',
  pending: 'text-primary-700',
  scheduled: 'text-purple-700',
} as const;

interface ChoreCalendarViewProps {
  chores?: Chore[];
}

export const ChoreCalendarView = ({ chores = [] }: ChoreCalendarViewProps) => {
  const { currentDate, weekDates, handlePrevWeek, handleNextWeek, today, todayString } =
    useWeekCalendar();
  const currentYear = currentDate.getFullYear();
  const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];

  /**UI 전용 상태 확인 */
  const getChoreUIStatus = (chore: Chore): keyof typeof STATUS_COLORS => {
    if (chore.status === 'done') return 'done';

    const targetDateStr = chore.endDate || chore.startDate;
    const targetDate = new Date(targetDateStr);
    targetDate.setHours(0, 0, 0, 0);

    return targetDate.getTime() <= today.getTime() ? 'pending' : 'scheduled';
  };

  const weekDays = weekDates.map((dateStr, index) => {
    const choresForDay = chores.filter(chore => {
      const targetDateStr = chore.endDate || chore.startDate;
      const dateObj = new Date(targetDateStr);
      const month = String(dateObj.getMonth() + 1).padStart(2, '0');
      const day = String(dateObj.getDate()).padStart(2, '0');

      return `${month}.${day}` === dateStr;
    });

    return {
      day: daysOfWeek[index],
      date: dateStr,
      chores: choresForDay,
    };
  });

  const headerDataText = `${currentYear}.${weekDates[0]} ~ ${weekDates[6]}`;

  return (
    <div className="flex flex-col bg-white">
      {/*좌측 날짜*/}
      <div className="flex items-center justify-between py-[10px]">
        <div className="flex items-center gap-[16px]">
          <button
            onClick={handlePrevWeek}
            className="flex h-[34px] w-[34px] p-[7px] items-center justify-center rounded-full border border-gray-100 bg-white hover:bg-primary-100 transition-colors"
          >
            <ChevronLeft className="h-5 w-5 text-gray-700" />
          </button>
          <h2 className="text-[16px] text-center font-bold text-gray-900">{headerDataText}</h2>
          <button
            onClick={handleNextWeek}
            className="flex h-[34px] w-[34px] p-[7px] items-center justify-center rounded-full border border-gray-100 bg-white hover:bg-primary-100 transition-colors"
          >
            <ChevronRight className="h-5 w-5 text-gray-700" />
          </button>
        </div>

        {/*우측 상태*/}
        <div className="flex items-center gap-[16px] text-[14px] font-medium text-gray-900">
          <div className="flex items-center gap-[6px]">
            <Circle size={10} fill="currentColor" strokeWidth={0} className={STATUS_COLORS.done} />
            완료
          </div>
          <div className="flex items-center gap-[6px]">
            <Circle
              size={10}
              fill="currentColor"
              strokeWidth={0}
              className={STATUS_COLORS.pending}
            />
            미완료
          </div>
          <div className="flex items-center gap-[6px]">
            <Circle
              size={10}
              fill="currentColor"
              strokeWidth={0}
              className={STATUS_COLORS.scheduled}
            />
            예정
          </div>
        </div>
      </div>

      {/*7일 캘린더 그리드*/}
      <div className="grid grid-cols-7 overflow-hidden rounded-xl border border-gray-100">
        {weekDays.map((day, index) => {
          const isToday = day.date === todayString;

          return (
            <div
              key={index}
              className="flex min-h-[180px] flex-col border-r border-gray-100 last:border-r-0"
            >
              <div
                className={`flex flex-col items-center justify-center py-[12px] ${isToday ? 'bg-primary-600 text-white' : 'bg-primary-100'}`}
              >
                <span
                  className={`text-[12px] font-bold ${isToday ? 'text-white' : 'text-primary-700'}`}
                >
                  {day.day}
                </span>
                <span
                  className={`text-[14px] font-bold ${isToday ? 'text-white' : 'text-gray-700'}`}
                >
                  {day.date}
                </span>
              </div>

              <div className="flex-1 p-[12px] bg-white">
                <div className="flex flex-col gap-[12px]">
                  {day.chores.map(chore => {
                    const uiStatus = getChoreUIStatus(chore);
                    return (
                      <div
                        key={chore.id}
                        className={`flex flex-col gap-0 ${uiStatus === 'done' ? 'opacity-50' : ''}`}
                      >
                        <div className="flex items-center gap-[6px]">
                          <Circle
                            size={8}
                            fill="currentColor"
                            strokeWidth={0}
                            className={STATUS_COLORS[uiStatus]}
                          />
                          <span
                            className={`text-[12px] text-gray-900 font-bold leading-tight ${uiStatus === 'done' ? 'line-through' : ''}`}
                          >
                            {chore.name}
                          </span>
                        </div>
                        <span className="pl-[14px] text-[10px] text-gray-600">
                          {chore.assignee.name}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
