import { DaysOfWeek } from "@/types/constants"
import type { SheetDate } from "@/types/index"

export const getDatesOfWeek = (date: Date): SheetDate[] => {
  const day = date.getDay()
  const diffToMonday = (day + 6) % 7 // Calculate difference to Monday
  const monday = new Date(date)
  monday.setDate(date.getDate() - diffToMonday)

  const weekDates = DaysOfWeek.map((day, index) => {
    const date = new Date(monday)
    date.setDate(monday.getDate() + index)
    return {
      date,
      day,
      localeDateString: dateToLocaleString(date),
    }
  })

  return weekDates
}

// Function that gets the moday of the week
export const getMondayDate = (date: Date) => {
  const day = date.getDay()
  const diff = date.getDate() - day + (day === 0 ? -6 : 1) // adjust when day is sunday
  return new Date(date.setDate(diff))
}

/**
 * Convert a string representing a timestamp (from getTime) to a Date object.
 * @param timestampString - The string representing the timestamp.
 * @returns The Date object.
 */
export function timestampStringToDate(timestampString: string): Date {
  const timestamp = parseInt(timestampString, 10)
  return new Date(timestamp)
}

export const dateToDayString = (date: Date) => {
  return new Intl.DateTimeFormat(navigator.language, {
    weekday: "long",
  }).format(date)
}

// TODo: Change to dynamic locale
// Make can cause hydration issue
export const dateToLocaleString = (date: Date, locale = "en-AU") => {
  return new Intl.DateTimeFormat(locale).format(date)
}

/**
 * Format a date as a string in DDMMYYYY format.
 * @param date - The date to format.
 * @returns The formatted date string.
 */
export function formatDateDDMMYYYY(date: Date): string {
  const pad = (num: number) => num.toString().padStart(2, "0")
  const day = pad(date.getDate())
  const month = pad(date.getMonth() + 1) // Months are zero-based
  const year = date.getFullYear().toString()
  return `${day}${month}${year}`
}

// get date value with time set to 00:00:00
export const getDateValue = (date: Date) => {
  const newDate = new Date(date)
  newDate.setHours(0, 0, 0, 0)
  return newDate
}
