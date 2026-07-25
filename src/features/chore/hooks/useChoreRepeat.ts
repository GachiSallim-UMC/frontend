import { useEffect, useState } from 'react';
import type { CustomOption, DayOfWeek, RepeatType } from '../types/chore.types';

export const useChoreRepeat = () => {
  const [repeatType, setRepeatType] = useState<RepeatType>('NONE');
  const [customOption, setCustomOption] = useState<CustomOption>('SPECIFIC_DAYS');
  const [repeatInterval, setRepeatInterval] = useState('1');
  const [repeatDays, setRepeatDays] = useState<DayOfWeek[]>([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    if (repeatType === 'WEEKLY' && startDate) {
      const date = new Date(startDate);
      if (!isNaN(date.getTime())) {
        const dayIndex = date.getDay();
        const jsDaysMap: DayOfWeek[] = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
        setRepeatDays([jsDaysMap[dayIndex]]);
      }
    } else if (repeatType !== 'CUSTOM' || customOption !== 'SPECIFIC_DAYS') {
      if (repeatType !== 'WEEKLY') setRepeatDays([]);
    }
  }, [repeatType, startDate, customOption]);

  const toggleDay = (day: DayOfWeek) => {
    setRepeatDays(prev => (prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]));
  };

  const isDaysEnabled = repeatType === 'CUSTOM' && customOption === 'SPECIFIC_DAYS';

  return {
    repeatType,
    setRepeatType,
    customOption,
    setCustomOption,
    repeatInterval,
    setRepeatInterval,
    repeatDays,
    setRepeatDays,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    toggleDay,
    isDaysEnabled,
  };
};
