import { create } from 'zustand';
import { startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';
import {
  TimeSheetFormEntry,
  deleteEntry,
  getEntries,
} from '@/lib/server/timesheet';

interface TimesheetState {
  currentDate: Date;
  isLoading: boolean;
  isSaving: 'idle' | 'saving' | 'saved' | 'error';
  entries: TimeSheetFormEntry[];
  weekDays: Date[];
  setCurrentDate: (date: Date) => void;
  setEntries: (entries: TimeSheetFormEntry[]) => void;
  deleteEntry: (entry: TimeSheetFormEntry) => Promise<void>;
  fetchEntries: () => Promise<void>;
}

export const useTimesheetStore = create<TimesheetState>((set, get) => ({
  currentDate: new Date(),
  isLoading: false,
  isSaving: 'idle',
  entries: [],
  weekDays: [],
  setCurrentDate: (date: Date): void => {
    set({ currentDate: date });
    void get().fetchEntries();
  },
  setEntries: (entries: TimeSheetFormEntry[]): void => set({ entries }),
  fetchEntries: async (): Promise<void> => {
    set({ isLoading: true });
    try {
      const weekDays = eachDayOfInterval({
        start: startOfWeek(get().currentDate),
        end: endOfWeek(get().currentDate),
      });
      const entries = await getEntries(weekDays);
      set({ weekDays, entries });
    } finally {
      set({ isLoading: false });
    }
  },
  deleteEntry: async (entry: TimeSheetFormEntry): Promise<void> => {
    set({ isSaving: 'saving' });
    try {
      await deleteEntry(entry);
      await get().fetchEntries();
      set({ isSaving: 'saved' });
    } catch (error) {
      set({ isSaving: 'error' });
    } finally {
      setTimeout(() => set({ isSaving: 'idle' }), 8000);
    }
  },
}));
