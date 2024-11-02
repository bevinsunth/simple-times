import type { Models } from "node-appwrite"

export type TimeEntryDocument = Models.Document & TimeEntryData

export interface TimeEntryData {
  date: Date
  hours: number
}

// Type mapping between collection names and their corresponding types
export interface CollectionTypeMapping {
  timeEntry: TimeEntryDocument
}

export type AllDocumentTypes = TimeEntryDocument | Models.Document

export type AllDataTypes = TimeEntryData


export const DaysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];


export interface SheetDate extends TimeEntryData {
    localeDateString: string;
    day: typeof DaysOfWeek[number];
}
