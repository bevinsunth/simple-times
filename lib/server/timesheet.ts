"use server"

import { ID, Query } from "node-appwrite"

import type {
  TimeEntryData,
  TimeEntryDocument,
} from "@/lib/types/document-data.types"

import { compareDates, formatDateDDMMYYYY, getDateValue, parseDateDDMMYYYY } from "../date-utils"
import { GetDbOperations } from "./databases"


export const addOrUpdateWeeklyTimeSheet = async (entries: TimeEntryData[]) => {
  console.log("addOrUpdateWeeklyTimeSheet called")
  // remove any entries with invalid date or hours value
    const validEntries = entries.filter((entry) => {
    const isValidHours = typeof entry.hours === "number" && entry.hours > 0
    return isValidHours
  })

  await Promise.all(
      validEntries.map((entry) => {
          addOrUpdateTimeEntryDocument(entry)
      })
  )
}

async function addOrUpdateTimeEntryDocument(
  entry: TimeEntryData
): Promise<boolean> {

const timeEntryCollection = await GetDbOperations<TimeEntryDocument>("timeEntry")

  const timeEntryDocuments = await timeEntryCollection.query([
    Query.equal("date", entry.date),
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

export async function populateTimeEntryData(
  dates: Date[]
): Promise<TimeEntryData[]> {

  console.log("populateTimeEntryData called")
  console.log(dates)

  const timeEntryCollection = await GetDbOperations<TimeEntryDocument>("timeEntry")
  
  const queries = [Query.equal("date", dates.map((date) => formatDateDDMMYYYY(date)))]
  const timeEntryDocuments = await timeEntryCollection.query(queries)
  
    const timeEntryData = dates.map((date) => {
        const document = timeEntryDocuments.documents.find((doc) => compareDates(date, parseDateDDMMYYYY(doc.date)))
        return {
            date: formatDateDDMMYYYY(date),
            hours: document ? document.hours : 0,
        }
    })
    return timeEntryData
}
