import { useEffect, useState } from 'react';
import { CustomOption, DayOfWeek, RepeatType } from '../types/chore.types';

export const useChoreRepeat = () => {
  const [repeatType, setRepeatType] = useState<RepeatType>('once');
  const [customOption, setCustomOption] = useState<CustomOption>('specific_days');
  const [repeatInterval, setRepeatInterval] = useState('1');
  const [repeatDays, setRepeatDays] = useState<DayOfWeek[]>([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  useEffect(() => {
    if (repeatType === 'weekly' && startDate) {
      const date = new Date(startDate);
      if (!isNaN(date.getTime())) {
        const dayIndex = date.getDay();
        const jsDaysMap: DayOfWeek[] = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
        setRepeatDays([jsDaysMap[dayIndex]]);
      }
    } else if (repeatType !== 'custom' || customOption !== 'specific_days') {
      if (repeatType !== 'weekly') setRepeatDays([]);
    }
  }, [repeatType, startDate, customOption]);

  const toggleDay = (day: DayOfWeek) => {
    setRepeatDays(prev => (prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]));
  };

  const isDaysEnabled = repeatType === 'custom' && customOption === 'specific_days';

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
