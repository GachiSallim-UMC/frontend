import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { DateFormatValue } from '@/shared/types/common';

interface DateFormatState {
  dateFormat: DateFormatValue;
  setDateFormat: (format: DateFormatValue) => void;
}

export const useDateFormatStore = create<DateFormatState>()(
  persist(
    set => ({
      dateFormat: 'YYYY/MM/DD',
      setDateFormat: format => set({ dateFormat: format }),
    }),
    { name: 'gachi-salim-date-format' },
  ),
);
