import type { Models } from "node-appwrite"

export type TimeEntryDocument = Models.Document & TimeEntryData

export interface TimeEntryData {
  date: string
  hours: number
}

