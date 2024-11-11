import type { Models } from 'node-appwrite';

export type TimeEntryDocument = Models.Document & ExtendedDocument & TimeEntryData;

export interface ExtendedDocument {
  userId: string;
}

export interface TimeEntryData {
  date: Date;
  client: string;
  project: string;
  hours: number;
  timeEntryIdentifier: string;
}
