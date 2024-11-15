import type {} from '@redux-devtools/extension'; // required for devtools typing

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

import type { SheetDate } from '@/types';

interface WeeklySheetState {
  activeSheetDates: SheetDate[];
  addSheetDates: (dates: SheetDate[]) => void;
  timesheets: DayTimeSheet[];
  addTimeSheets: (daySheets: DayTimeSheet[]) => void;
}

interface DayTimeSheet {
  date: Date;
  client: string;
  project: string;
  hours: number;
  notes: string;
}

export const useSheetStore = create<WeeklySheetState>()(
  devtools(
    persist(
      set => ({
        activeSheetDates: [],
        addSheetDates: dates =>
          set(state => ({
            activeSheetDates: dates,
          })),
        timesheets: [],
        addTimeSheets: daySheets =>
          set(state => ({
            timesheets: [...state.timesheets, ...daySheets],
          })),
      }),
      {
        name: 'timesheet-storage',
      }
    )
  )
);
