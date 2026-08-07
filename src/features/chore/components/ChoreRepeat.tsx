import { SelectDropdown, FormInput } from '@/shared/components';
import type {
  ChoreApiCustomOption as CustomOption,
  ChoreApiDayOfWeek as DayOfWeek,
  ChoreApiRepeatType as RepeatType,
} from '../types/chore.types';
import type { ChoreFormErrors } from '../hooks/useChoreForm';
import CalendarIcon from '@/assets/icons/chore/calendar.svg';
import { isUnsignedIntegerInput } from '@/shared/lib/inputValidation';
import {
  CUSTOM_OPTIONS,
  REPEAT_TYPE_OPTIONS,
  WEEK_OPTIONS,
  MONTH_OPTIONS,
  DAYS,
} from '../constants/chore.constants';

interface ChoreRepeatProps {
  repeatType: RepeatType | '';
  customOption: CustomOption | '';
  repeatInterval: string;
  repeatDays: DayOfWeek[];
  startDate: string;
  dueDate: string;
  errors?: ChoreFormErrors;
  onChange: (updates: Partial<ChoreRepeatProps>) => void;
}

/** 브라우저 기본 달력 아이콘 대신 노출하는 커스텀 달력 버튼 */
const DatePickerButton = ({ inputId, label }: { inputId: string; label: string }) => (
  <button
    type="button"
    aria-label={`${label} 달력 열기`}
    className="flex h-4 w-4 items-center justify-center"
    onClick={() => {
      const input = document.getElementById(inputId);
      if (input instanceof HTMLInputElement) input.showPicker?.();
    }}
  >
    <img src={CalendarIcon} alt="" className="h-full w-full object-contain" />
  </button>
);

export const ChoreRepeat = ({
  repeatType,
  customOption,
  repeatInterval,
  repeatDays,
  startDate,
  dueDate,
  errors = {},
  onChange,
}: ChoreRepeatProps) => {
  const isDaysEnabled =
    repeatType === 'WEEKLY' || (repeatType === 'CUSTOM' && customOption === 'SPECIFIC_DAYS');

  const toggleDay = (day: DayOfWeek) => {
    if (repeatDays.includes(day)) {
      onChange({ repeatDays: repeatDays.filter(d => d !== day) });
    } else {
      onChange({ repeatDays: [...repeatDays, day] });
    }
  };

  return (
    <section className="flex w-full flex-col bg-transparent gap-[16px] lg:gap-[20px] lg:rounded-[18px] lg:bg-white lg:p-[30px]">
      <h2 className="hidden text-[18px] font-bold text-gray-800 lg:block">반복 주기</h2>

      <div className="flex w-full flex-col gap-[16px] lg:flex-row lg:gap-[20px]">
        <div className="flex flex-1 flex-col gap-[16px] lg:gap-[20px]">
          <SelectDropdown<RepeatType | ''>
            label="반복 유형"
            required
            options={REPEAT_TYPE_OPTIONS as { label: string; value: RepeatType }[]}
            value={repeatType}
            error={errors.repeatType}
            onChange={value => {
              onChange({
                repeatType: value,
                customOption: '',
                repeatInterval: '',
                repeatDays: [],
              });
            }}
            inputSize="sm"
          />

          {repeatType === 'CUSTOM' && (
            <SelectDropdown<CustomOption>
              label="사용자 지정 옵션"
              options={CUSTOM_OPTIONS as { label: string; value: CustomOption }[]}
              value={customOption}
              error={errors.customOption}
              onChange={value => {
                onChange({
                  customOption: value,
                  repeatInterval: '',
                  repeatDays: [],
                });
              }}
              inputSize="sm"
            />
          )}

          {repeatType === 'CUSTOM' && customOption === 'EVERY_N_DAYS' && (
            <FormInput
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={2}
              label="반복일 (N일마다)"
              placeholder="숫자 입력 (예: 3)"
              value={repeatInterval}
              error={errors.repeatInterval}
              onChange={e => {
                const val = e.target.value;
                if (
                  val === '' ||
                  (isUnsignedIntegerInput(val) && Number(val) >= 1 && Number(val) <= 99)
                ) {
                  onChange({ repeatInterval: val });
                }
              }}
              inputSize="sm"
            />
          )}
          {repeatType === 'CUSTOM' && customOption === 'EVERY_N_WEEKS' && (
            <SelectDropdown
              label="반복 주기 (N주마다)"
              options={WEEK_OPTIONS}
              value={repeatInterval}
              onChange={value => onChange({ repeatInterval: value })}
              inputSize="sm"
            />
          )}
          {repeatType === 'CUSTOM' && customOption === 'EVERY_N_MONTHS' && (
            <SelectDropdown
              label="반복 월 (N개월마다)"
              options={MONTH_OPTIONS}
              value={repeatInterval}
              onChange={value => onChange({ repeatInterval: value })}
              inputSize="sm"
            />
          )}
        </div>

        <div className="flex flex-1 flex-col gap-1.5">
          <label className="text-caption font-bold text-gray-800">
            반복 요일 {isDaysEnabled ? ' ' : '(매주 선택 시)'}
          </label>
          <div className="flex lg:h-[50px] items-center gap-[12px] lg:gap-4">
            {DAYS.map(day => (
              <label key={day.value} className="flex items-center gap-1 lg:gap-2">
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
                  className={`text-[12px] lg:text-[16px] ${!isDaysEnabled ? 'text-gray-400' : 'text-gray-700'}`}
                >
                  {day.label}
                </span>
              </label>
            ))}
          </div>
          {errors.repeatDays && <p className="text-xs text-red-500">{errors.repeatDays}</p>}
        </div>
      </div>

      <div className="flex w-full gap-[8px] lg:gap-[20px]">
        <div className="flex-1">
          <FormInput
            id="chore-start-date"
            type="date"
            label="시작일"
            placeholder="yyyy/mm/dd"
            required
            value={startDate}
            onChange={e => onChange({ startDate: e.target.value })}
            max={dueDate || undefined}
            error={errors.startDate}
            className="[&::-webkit-calendar-picker-indicator]:hidden"
            rightAddon={<DatePickerButton inputId="chore-start-date" label="시작일" />}
            inputSize="sm"
          />
        </div>
        <div className="flex-1">
          <FormInput
            id="chore-due-date"
            type="date"
            label="종료일 (선택)"
            placeholder="yyyy/mm/dd"
            value={dueDate}
            onChange={e => onChange({ dueDate: e.target.value })}
            min={startDate || undefined}
            error={errors.dueDate}
            className="[&::-webkit-calendar-picker-indicator]:hidden"
            rightAddon={<DatePickerButton inputId="chore-due-date" label="종료일" />}
            inputSize="sm"
          />
        </div>
      </div>
    </section>
  );
};
