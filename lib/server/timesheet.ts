"use server"

import { ID, Query } from "node-appwrite"

import type {
  TimeEntryData,
  TimeEntryDocument,
} from "@/lib/types/document-data.types"

import { getDateValue } from "../date-utils"
import { GetDbOperations } from "./databases"


export const addOrUpdateWeeklyTimeSheet = async (entries: TimeEntryData[]) => {
  // remove any entries with invalid date or hours value
  const validEntries = entries.filter((entry) => {
    const isValidDate = !isNaN(entry.date.getTime())
    const isValidHours = typeof entry.hours === "number" && entry.hours > 0
    return isValidDate && isValidHours
  })

  await Promise.all(
      validEntries.map((entry) => {
          //set date to midnight
          entry.date = getDateValue(entry.date)
          addOrUpdateTimeEntryDocument(entry)
      })
  )
}

async function addOrUpdateTimeEntryDocument(
  entry: TimeEntryData
): Promise<boolean> {

    const timeEntryCollection = await GetDbOperations<TimeEntryDocument>("timeEntry")

  const timeEntryDocuments = await timeEntryCollection.query([
    Query.equal("date", getDateValue(entry.date).toISOString()),
  ])
  const timeEntryDocument = timeEntryDocuments.documents[0]

  try {
    if (timeEntryDocument) {
      timeEntryDocument.hours = entry.hours
      timeEntryDocument.date = entry.date
      await timeEntryCollection.update(timeEntryDocument.$id, timeEntryDocument)
      return true
    }
    await timeEntryCollection.create(ID.unique(), entry)
    return true
  } catch (error) {
    return false
  }
}

async function getTimeEntryData(
  entry: TimeEntryData
): Promise<boolean> {

    const timeEntryCollection = await GetDbOperations<TimeEntryDocument>("timeEntry")

  const timeEntryDocuments = await timeEntryCollection.query([
    Query.equal("date", getDateValue(entry.date).toISOString()),
  ])
  const timeEntryDocument = timeEntryDocuments.documents[0]

  try {
    if (timeEntryDocument) {
      timeEntryDocument.hours = entry.hours
      timeEntryDocument.date = entry.date
      await timeEntryCollection.update(timeEntryDocument.$id, timeEntryDocument)
      return true
    }
    await timeEntryCollection.create(ID.unique(), entry)
    return true
  } catch (error) {
    return false
  }
}
