"use server"

import { ID, Query } from "node-appwrite"

import type {
  TimeEntryData,
  TimeEntryDocument,
} from "@/lib/types/document-data.types"

import { compareDates, formatDateDDMMYYYY, getDateValue, parseDateDDMMYYYY } from "../date-utils"
import { GetDbOperations } from "./databases"
import { console } from "inspector"


export const addOrUpdateWeeklyTimeSheet = async (entries: TimeEntryData[]) => {
  console.log("addOrUpdateWeeklyTimeSheet called")
  // remove any entries with invalid date or hours value
    const validEntries = entries.filter((entry) => {
    const isValidHours = typeof entry.hours === "number" && entry.hours > 0
    return isValidHours
    })
  
  console.log(validEntries)

  await Promise.all(
      validEntries.map((entry) => {
          addOrUpdateTimeEntryDocument(entry)
      })
  )
}

async function addOrUpdateTimeEntryDocument(
  entry: TimeEntryData
): Promise<boolean> {

      console.log(entry)

const timeEntryCollection = await GetDbOperations<TimeEntryDocument>("timeEntry")

  const timeEntryDocuments = await timeEntryCollection.query([
    Query.equal("dateString", entry.dateString),
  ])
  const timeEntryDocument = timeEntryDocuments.documents[0]

  try {
    if (timeEntryDocument) {
      timeEntryDocument.hours = entry.hours
      timeEntryDocument.dateString = entry.dateString
      timeEntryDocument.dateTime = entry.dateTime
      await timeEntryCollection.update(timeEntryDocument.$id, timeEntryDocument)
      return true
    }
    await timeEntryCollection.create(ID.unique(), entry)
    return true
  } catch (error) {
    return false
  }
}

export async function populateTimeEntryData(
  dates: Date[]
): Promise<TimeEntryData[]> {

  console.log("populateTimeEntryData called")
  const timeEntryCollection = await GetDbOperations<TimeEntryDocument>("timeEntry")
  
  const queries = [Query.equal("dateString", dates.map((date) => formatDateDDMMYYYY(date)))]
  const timeEntryDocuments = await timeEntryCollection.query(queries)
  
    const timeEntryData = dates.map((date) => {
        const document = timeEntryDocuments.documents.find((doc) => compareDates(date, parseDateDDMMYYYY(doc.dateString)))
      return {
            dateTime: document?.dateTime ?? getDateValue(date),
            dateString: formatDateDDMMYYYY(date),
            hours: document ? document.hours : 0,
        }
    })
  console.log(timeEntryData)
    return timeEntryData
}

export async function getDocumentsForDatesBetween(startDate: Date, endDate: Date
): Promise<TimeEntryDocument[]> {

const timeEntryCollection = await GetDbOperations<TimeEntryDocument>("timeEntry")

  const timeEntryDocuments = await timeEntryCollection.query([
    Query.between("dateTime", getDateValue(startDate).toISOString(), getDateValue(endDate).toISOString()),
  ])
  return timeEntryDocuments.documents
}
