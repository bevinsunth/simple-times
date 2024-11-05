import type { Models } from "node-appwrite"

export type TimeEntryDocument = Models.Document & ExtendedDocument & TimeEntryData

export interface ExtendedDocument { 
  userId: string
}

export interface TimeEntryData {
  dateString: string
  dateTime: Date
  hours: number
}

