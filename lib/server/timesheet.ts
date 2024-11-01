"use server"

import { getDb } from "./databases"
import { timeEntry } from "@/lib/types/timeEntry.types"


export const addOrUpdateWeeklyTimeSheet = async (startingMondayDateString: string, entries: Record<string, number>) => { 
    console.log("addOrUpdateWeeklyTimeSheet", startingMondayDateString, entries)
    //remove any keys with 0 value or undefined
    for (const key in entries) {
        if (entries[key] === 0 || isNaN(entries[key])) {
            delete entries[key];
        }
    }
    const documentData: timeEntry = { date_hours_key_value: entries }
    const stringifiedData = JSON.stringify(documentData)

    console.log("addOrUpdateWeeklyTimeSheet", startingMondayDateString, stringifiedData)
    const db = await getDb()
    //first check if the document exists
    let existingTimeEntry;
    try {
        existingTimeEntry = await db.timeEntry.get(startingMondayDateString);
    } catch (error) {
        if ((error as any).response?.type !== "document_not_found") {
            throw error;
        }
    }
    if (existingTimeEntry) {
 db.timeEntry.update(startingMondayDateString, stringifiedData)
    }
    else {
        db.timeEntry.create(startingMondayDateString, stringifiedData)
    }
}