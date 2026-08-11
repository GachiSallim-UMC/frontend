import { ChevronLeft, ChevronRight, Circle } from 'lucide-react';
import { getChoreTargetDateStr, getChoreUIStatus } from '../hooks/useChoreStatus';
import type { Chore } from '../types/chore.types';

const STATUS_COLORS = {
  done: 'text-green-700',
  pending: 'text-primary-700',
  scheduled: 'text-purple-700',
} as const;

interface ChoreCalendarViewProps {
  chores?: Chore[];
  selectedDate: string;
  weekDates: string[];
  weekDateValues: string[];
  dayLabels: string[];
  todayDate: string;
  onPrevWeek: () => void;
  onNextWeek: () => void;
  onSelectDate: (date: string) => void;
}

export const ChoreCalendarView = ({
  chores = [],
  selectedDate,
  weekDates,
  weekDateValues,
  dayLabels,
  todayDate,
  onPrevWeek,
  onNextWeek,
  onSelectDate,
}: ChoreCalendarViewProps) => {
  const weekDays = weekDateValues.map((dateValue, index) => {
    const choresForDay = chores.filter(chore => {
      return getChoreTargetDateStr(chore) === dateValue;
    });

    return {
      day: dayLabels[index],
      date: weekDates[index],
      dateValue,
      chores: choresForDay,
    };
  });

  const fromYear = weekDateValues[0].slice(0, 4);
  const toYear = weekDateValues[6].slice(0, 4);
  const headerDataText =
    fromYear === toYear
      ? `${fromYear}.${weekDates[0]} ~ ${weekDates[6]}`
      : `${fromYear}.${weekDates[0]} ~ ${toYear}.${weekDates[6]}`;

  return (
    <div className="flex flex-col bg-transparent lg:bg-white">
      {/**모바일 디자인 */}
      <div className="flex w-full items-start lg:hidden">
        <button
          type="button"
          aria-label="이전 주"
          onClick={onPrevWeek}
          className="mt-[20px] flex h-[38px] w-6 shrink-0 items-center justify-center"
        >
          <ChevronLeft size={20} className="text-gray-700" />
        </button>
        <div className="grid min-w-0 flex-1 grid-cols-7">
          {weekDays.map((day, index) => {
            const isToday = day.dateValue === todayDate;
            const isSelected = day.dateValue === selectedDate;
            const dayNumber = Number(day.date.split('.')[1]);
            const hasIncompleteChores = day.chores.some(
              chore => getChoreUIStatus(chore) !== 'done',
            );
            return (
              <div key={index} className="flex min-w-0 flex-col items-center">
                <span className="mb-[6px] flex h-[14px] items-center text-[12px] leading-none text-gray-700">
                  {day.day}
                </span>
                <button
                  type="button"
                  aria-label={`${day.dateValue} 집안일 보기`}
                  aria-pressed={isSelected}
                  onClick={() => onSelectDate(day.dateValue)}
                  className={`flex size-[clamp(32px,9.75vw,38px)] items-center justify-center rounded-full text-[12px] font-bold transition-colors ${
                    isSelected ? 'bg-primary-700 text-white' : 'bg-white text-gray-600'
                  }`}
                >
                  {dayNumber}
                </button>
                <div className="mt-[6px] flex h-[4px] items-center justify-center">
                  {hasIncompleteChores && (
                    <div className="h-[4px] w-[4px] rounded-full bg-primary-700" />
                  )}
                </div>
                {isSelected && (
                  <div className="mt-[12px] h-[2px] w-[clamp(32px,9.75vw,38px)] bg-primary-700" />
                )}
                {!isSelected && isToday && <span className="sr-only">오늘</span>}
              </div>
            );
          })}
        </div>
        <button
          type="button"
          aria-label="다음 주"
          onClick={onNextWeek}
          className="mt-[20px] flex h-[38px] w-6 shrink-0 items-center justify-center"
        >
          <ChevronRight size={20} className="text-gray-700" />
        </button>
      </div>

      {/**PC 디자인 */}
      {/*좌측 날짜*/}
      <div className="hidden lg:flex lg:items-center lg:justify-between lg:py-[10px]">
        <div className="flex items-center gap-[16px]">
          <button
            type="button"
            aria-label="이전 주"
            onClick={onPrevWeek}
            className="flex h-[34px] w-[34px] p-[7px] items-center justify-center rounded-full border border-gray-100 bg-white hover:bg-primary-100 transition-colors"
          >
            <ChevronLeft size={20} className="text-gray-700" />
          </button>
          <h2 className="text-[16px] text-center font-bold text-gray-900">{headerDataText}</h2>
          <button
            type="button"
            aria-label="다음 주"
            onClick={onNextWeek}
            className="flex h-[34px] w-[34px] p-[7px] items-center justify-center rounded-full border border-gray-100 bg-white hover:bg-primary-100 transition-colors"
          >
            <ChevronRight size={20} className="text-gray-700" />
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
      <div className="hidden lg:grid lg:grid-cols-7 overflow-hidden rounded-xl border border-gray-100">
        {weekDays.map((day, index) => {
          const isToday = day.dateValue === todayDate;

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
