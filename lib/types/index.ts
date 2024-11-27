import { TimeEntry, Client, Project } from '@prisma/client';

//Used in the server
export type Data<T> = Omit<T, 'updatedAt' | 'createdAt' | 'userId' | 'id'> & {
  id?: string;
};
export type TimeEntryData = Data<TimeEntry>;
export type ClientData = Data<Client>;
export type ProjectData = Data<Project>;

//Used in the client
export interface Option {
  value: string; // This is what gets stored as clientId/projectId
  label: string; // This is what gets displayed to the user
}

export type ClientAndProject = {
  client: ClientData;
  projects: ProjectData[];
};
