import type { Models } from 'node-appwrite';

export type TimeEntryDocument = Models.Document & ExtendedData & TimeEntryData;

export type TimeEntryDocumentData = Omit<
  TimeEntryDocument,
  keyof Models.Document
>;

interface ExtendedData {
  userId: string;
}

export interface TimeEntryData {
  date: Date;
  client: string;
  project: string;
  hours: number;
  timeEntryIdentifier: string;
}
