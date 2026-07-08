import { ChevronLeft, ChevronRight, Circle } from 'lucide-react';
import { useWeekCalendar } from '../hooks/useWeekCalendar';
import type { Chore } from '../types/chore.types';

const STATUS_COLORS = {
  pending: 'text-green-700',
  done: 'text-primary-700',
  scheduled: 'text-purple-700',
} as const;

export const ChoreCalendarView = () => {
  const { currentDate, weekDates, handlePrevWeek, handleNextWeek } = useWeekCalendar();
  const currentYear = currentDate.getFullYear();
  const today = new Date();
  const todayString = `${String(today.getMonth() + 1).padStart(2, '0')}.${String(today.getDate()).padStart(2, '0')}`;

  //Mock data for the calendar view
  const weekDays = [
    {
      day: '일',
      date: weekDates[0],
      chores: [
        {
          id: '1',
          name: '설거지',
          assignee: { id: 'u1', name: '김영희', nickname: '영희', email: 'a@test.com' },
          status: 'done',
        },
        {
          id: '2',
          name: '화장실 청소',
          assignee: { id: 'u2', name: '홍길동', nickname: '길동', email: 'b@test.com' },
          status: 'pending',
        },
      ] as Partial<Chore>[], // 임시 데이터이므로 Partial 적용
    },
    {
      day: '월',
      date: weekDates[1],
      chores: [
        {
          id: '3',
          name: '설거지',
          assignee: { id: 'u1', name: '김영희', nickname: '영희', email: 'a@test.com' },
          status: 'scheduled',
        },
        {
          id: '4',
          name: '화장실 청소',
          assignee: { id: 'u2', name: '홍길동', nickname: '길동', email: 'b@test.com' },
          status: 'pending',
        },
        {
          id: '5',
          name: '장보기',
          assignee: { id: 'u3', name: '이철수', nickname: '철수', email: 'c@test.com' },
          status: 'scheduled',
        },
      ] as Partial<Chore>[],
    },
    {
      day: '화',
      date: weekDates[2],
      chores: [
        {
          id: '6',
          name: '설거지',
          assignee: { id: 'u1', name: '김영희', nickname: '영희', email: 'a@test.com' },
          status: 'pending',
        },
      ] as Partial<Chore>[],
    },
    {
      day: '수',
      date: weekDates[3],
      chores: [
        {
          id: '7',
          name: '설거지',
          assignee: { id: 'u1', name: '김영희', nickname: '영희', email: 'a@test.com' },
          status: 'pending',
        },
      ] as Partial<Chore>[],
    },
    {
      day: '목',
      date: weekDates[4],
      chores: [
        {
          id: '8',
          name: '설거지',
          assignee: { id: 'u1', name: '김영희', nickname: '영희', email: 'a@test.com' },
          status: 'pending',
        },
        {
          id: '9',
          name: '냉장고 정리',
          assignee: { id: 'u2', name: '홍길동', nickname: '길동', email: 'b@test.com' },
          status: 'scheduled',
        },
      ] as Partial<Chore>[],
    },
    {
      day: '금',
      date: weekDates[5],
      chores: [
        {
          id: '10',
          name: '설거지',
          assignee: { id: 'u1', name: '김영희', nickname: '영희', email: 'a@test.com' },
          status: 'pending',
        },
      ] as Partial<Chore>[],
    },
    {
      day: '토',
      date: weekDates[6],
      chores: [
        {
          id: '11',
          name: '설거지',
          assignee: { id: 'u1', name: '김영희', nickname: '영희', email: 'a@test.com' },
          status: 'pending',
        },
        {
          id: '12',
          name: '분리수거',
          assignee: { id: 'u3', name: '이철수', nickname: '철수', email: 'c@test.com' },
          status: 'pending',
        },
      ] as Partial<Chore>[],
    },
  ];
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
            <Circle
              size={10}
              fill="currentColor"
              strokeWidth={0}
              className={STATUS_COLORS.pending}
            />
            미완료
          </div>
          <div className="flex items-center gap-[6px]">
            <Circle size={10} fill="currentColor" strokeWidth={0} className={STATUS_COLORS.done} />
            완료
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
                  {day.chores.map(chore => (
                    <div
                      key={chore.id}
                      className={`flex flex-col gap-0 ${chore.status === 'done' ? 'opacity-50' : ''}`}
                    >
                      <div className="flex items-center gap-[6px]">
                        <Circle
                          size={8}
                          fill="currentColor"
                          strokeWidth={0}
                          className={STATUS_COLORS[chore.status as keyof typeof STATUS_COLORS]}
                        />
                        <span
                          className={`text-[12px] text-gray-900 font-bold leading-tight ${chore.status === 'done' ? 'line-through' : ''}`}
                        >
                          {chore.name}
                        </span>
                      </div>
                      <span className="pl-[14px] text-[10px] text-gray-600">
                        {chore.assignee?.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
