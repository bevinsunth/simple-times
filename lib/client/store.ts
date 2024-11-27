import { create } from 'zustand';
import { startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';
import {
  addNewClient,
  addNewProject,
  deleteEntry,
  deleteExistingClient,
  deleteExistingProject,
  getClientAndProjectList,
  getEntries,
  saveEntries,
} from '@/lib/utils/operations';
import {
  TimeEntryData,
  ClientData,
  ClientAndProject,
  ProjectData,
} from '../types';

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

interface ClientState {
  clientAndProjectList: ClientAndProject[];
  expandedClients: Record<string, boolean>;
  setClientAndProjectList: (list: ClientAndProject[]) => void;
  addClient: (client: ClientData) => Promise<void>;
  deleteClient: (clientId: string) => Promise<void>;
  addProject: (clientId: string, project: ProjectData) => Promise<void>;
  deleteProject: (clientId: string, projectId: string) => Promise<void>;
  fetchClientAndProjectList: () => Promise<void>;
  toggleClientExpanded: (clientId: string) => void;
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

export const useClientStore = create<ClientState>((set, get) => ({
  clientAndProjectList: [],
  expandedClients: {},
  fetchClientAndProjectList: async (): Promise<void> => {
    const list = await getClientAndProjectList();
    set({ clientAndProjectList: list });
  },
  setClientAndProjectList: (list: ClientAndProject[]) =>
    set({ clientAndProjectList: list }),
  addClient: async (client: ClientData) => {
    const newClient = await addNewClient(client);
    if (newClient) {
      set({
        clientAndProjectList: [
          ...get().clientAndProjectList,
          { client: newClient, projects: [] },
        ],
      });
    }
  },

  deleteClient: async (clientId: string): Promise<void> => {
    await deleteExistingClient(clientId);
    set(state => ({
      clientAndProjectList: state.clientAndProjectList.filter(
        item => item.client.id !== clientId
      ),
    }));
  },

  addProject: async (clientId: string, project: ProjectData): Promise<void> => {
    const newProject = await addNewProject(project);
    set(state => ({
      clientAndProjectList: state.clientAndProjectList.map(item => {
        if (item.client.id === clientId) {
          return { ...item, projects: [...item.projects, newProject] };
        }
        return item;
      }),
    }));
  },

  deleteProject: async (clientId: string, projectId: string): Promise<void> => {
    await deleteExistingProject(projectId);
    set(state => ({
      clientAndProjectList: state.clientAndProjectList.map(item => {
        if (item.client.id === clientId) {
          return {
            ...item,
            projects: item.projects.filter(project => project.id !== projectId),
          };
        }
        return item;
      }),
    }));
  },

  toggleClientExpanded: (clientId: string) =>
    set(state => ({
      expandedClients: {
        ...state.expandedClients,
        [clientId]: !state.expandedClients[clientId],
      },
    })),
}));
