import { create } from 'zustand';
import { startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';
import { deleteEntry, getEntries, saveEntries } from '@/lib/server/timesheet';
import { TimeEntryData } from '../types';

interface TimesheetState {
  currentDate: Date;
  isLoading: boolean;
  isSaving: 'idle' | 'saving' | 'saved' | 'error';
  entries: TimeEntryData[];
  weekDays: Date[];
  setCurrentDate: (date: Date) => void;
  setEntries: (entries: TimeEntryData[]) => void;
  deleteEntry: (entry: TimeEntryData) => Promise<void>;
  fetchEntries: () => Promise<void>;
  saveEntries: (entries: TimeEntryData[]) => Promise<void>;
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
  setEntries: (entries: TimeEntryData[]): void => set({ entries }),
  fetchEntries: async (): Promise<void> => {
    set({ isLoading: true });
    try {
      const weekDays = eachDayOfInterval({
        start: startOfWeek(get().currentDate),
        end: endOfWeek(get().currentDate),
      });
      const entries = await getEntries(
        startOfWeek(get().currentDate),
        endOfWeek(get().currentDate)
      );
      set({ entries, weekDays });
    } finally {
      set({ isLoading: false });
    }
  },
  saveEntries: async (entries: TimeEntryData[]): Promise<void> => {
    set({ isSaving: 'saving' });
    await saveEntries(entries);
    set({ isSaving: 'saved' });
  },
  deleteEntry: async (entry: TimeEntryData): Promise<void> => {
    set({ isSaving: 'saving' });
    try {
      await deleteEntry(entry.id);
      set({ isSaving: 'saved' });
    } catch (error) {
      set({ isSaving: 'error' });
    }
  },
}));
