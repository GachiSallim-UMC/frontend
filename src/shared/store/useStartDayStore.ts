import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { StartDayValue } from '@/shared/types/common';

interface StartDayState {
  startDay: StartDayValue;
  setStartDay: (startDay: StartDayValue) => void;
}

export const useStartDayStore = create<StartDayState>()(
  persist(
    set => ({
      startDay: 'sunday',
      setStartDay: startDay => set({ startDay }),
    }),
    { name: 'gachi-salim-start-day' },
  ),
);
