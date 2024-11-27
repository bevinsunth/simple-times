import { create } from 'zustand';
import { startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';
import { deleteEntry, getEntries, saveEntries } from '@/lib/server/timesheet';
import { TimeEntryData, TimeEntryFormData } from '../types';

interface TimesheetState {
  currentDate: Date;
  isLoading: boolean;
  isSaving: 'idle' | 'saving' | 'saved' | 'error';
  entries: TimeEntryData[];
  weekDays: Date[];
  setCurrentDate: (date: Date) => void;
  setEntries: (entries: TimeEntryData[]) => void;
  deleteEntry: (entry: TimeEntryFormData) => Promise<void>;
  fetchEntries: () => Promise<void>;
  saveEntries: (entries: TimeEntryFormData[]) => Promise<void>;
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
  saveEntries: async (entries: TimeEntryFormData[]): Promise<void> => {
    set({ isSaving: 'saving' });
    await saveEntries(entries);
    set({ isSaving: 'saved' });
  },
  deleteEntry: async (entry: TimeEntryFormData): Promise<void> => {
    set({ isSaving: 'saving' });
    try {
      //find entry by date and projectId and clientId
      const matchedEntry = get().entries.find(
        e =>
          e.date === entry.date &&
          e.projectId === entry.projectId &&
          e.clientId === entry.clientId
      );
      if (matchedEntry) {
        await deleteEntry(matchedEntry);
        set({
          entries: get().entries.filter(e => e.date !== entry.date),
        });
      }
      set({ isSaving: 'saved' });
    } catch (error) {
      set({ isSaving: 'error' });
    }
  },
}));
