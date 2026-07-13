import { SelectDropdown, FormInput } from '@/shared/components';
import { useChoreRepeat } from '../hooks/useChoreRepeat';
import {
  CUSTOM_OPTIONS,
  REPEAT_TYPE_OPTIONS,
  WEEK_OPTIONS,
  MONTH_OPTIONS,
  DAYS,
} from '../constants/chore.constants';
import type { DayOfWeek, RepeatType, CustomOption } from '../types/chore.types';

export const ChoreRepeat = () => {
  const {
    repeatType,
    setRepeatType,
    customOption,
    setCustomOption,
    repeatInterval,
    setRepeatInterval,
    repeatDays,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    toggleDay,
    isDaysEnabled,
  } = useChoreRepeat();

  return (
    <section className="flex w-full flex-col gap-[20px] rounded-[18px] bg-white p-[30px]">
      <h2 className="text-[18px] font-bold text-gray-800">반복 주기</h2>

      <div className="flex w-full gap-[20px]">
        <div className="flex flex-1 flex-col gap-[20px]">
          <SelectDropdown
            label="반복 유형"
            required
            options={REPEAT_TYPE_OPTIONS}
            value={repeatType}
            onChange={value => setRepeatType(value as RepeatType)}
          />

          {repeatType === 'custom' && (
            <SelectDropdown
              label="사용자 지정 옵션"
              options={CUSTOM_OPTIONS}
              value={customOption}
              onChange={value => setCustomOption(value as CustomOption)}
            />
          )}

          {repeatType === 'custom' && customOption === 'every_n_days' && (
            <FormInput
              type="number"
              label="반복일 (N일마다)"
              placeholder="숫자 입력 (예: 3)"
              value={repeatInterval}
              onChange={e => setRepeatInterval(e.target.value)}
            />
          )}
          {repeatType === 'custom' && customOption === 'every_n_weeks' && (
            <SelectDropdown
              label="반복 주기 (N주마다)"
              options={WEEK_OPTIONS}
              value={repeatInterval}
              onChange={setRepeatInterval}
            />
          )}
          {repeatType === 'custom' && customOption === 'every_n_months' && (
            <SelectDropdown
              label="반복 월 (N개월마다)"
              options={MONTH_OPTIONS}
              value={repeatInterval}
              onChange={setRepeatInterval}
            />
          )}
        </div>

        <div className="flex flex-1 flex-col gap-1.5">
          <label className="text-caption font-bold text-gray-800">
            반복 요일 {isDaysEnabled ? ' ' : '(매주 선택 시)'}
          </label>
          <div className="flex h-[50px] items-center gap-4">
            {DAYS.map(day => (
              <label key={day.value} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={repeatDays.includes(day.value as DayOfWeek)}
                  onChange={() => toggleDay(day.value as DayOfWeek)}
                  disabled={!isDaysEnabled}
                  className="
                      h-[20px] w-[20px] shrink-0 cursor-pointer appearance-none rounded-[3px] 
                      border border-gray-400 bg-white transition-colors
                      checked:border-primary-500 checked:bg-primary-500 
                      checked:bg-[url('data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMTYgMTYiIGZpbGw9IndoaXRlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGQ9Ik0xMi4yMDcgNC43OTNsLTEuNDE0LTEuNDE0TDYgOC41ODYgMy43MDcgNi4yOTNMMi4yOTMgNy43MDdsMy43MDcgMy43MDcgNy4yMDctNy4yMDd6Ii8+PC9zdmc+')]
                      checked:bg-center checked:bg-no-repeat
                      disabled:cursor-not-allowed disabled:opacity-50
                    "
                />
                <span
                  className={`text-[16px] ${!isDaysEnabled ? 'text-gray-400' : 'text-gray-700'}`}
                >
                  {day.label}
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="flex w-full gap-[20px]">
        <div className="flex-1">
          <FormInput
            type="date"
            label="시작일"
            placeholder="yyyy/mm/dd"
            required
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
          />
        </div>
        <div className="flex-1">
          <FormInput
            type="date"
            label="종료일 (선택)"
            placeholder="yyyy/mm/dd"
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
          />
        </div>
      </div>
    </section>
  );
};
