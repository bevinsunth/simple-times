import { format, parseISO, startOfWeek, addDays, startOfDay, isEqual, parse } from 'date-fns';

const DaysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

import { enAU } from 'date-fns/locale';

/**
 * Get the browser's locale.
 * @returns The browser's locale string.
 */
export const getBrowserLocale = (): string => {
  return navigator.language || 'en-AU';
};


/**
 * Convert a date to a day string (e.g., "Monday") using the browser's locale.
 * @param date - The date to convert.
 * @returns The day string.
 */
export const dateToDayString = (date: Date): string => {
  const locale = getBrowserLocale();
  return format(date, 'EEEE', { locale: enAU });
};

/**
 * Convert a date to a locale string using the browser's locale.
 * @param date - The date to convert.
 * @returns The locale date string.
 */
export const dateToLocaleString = (date: Date): string => {
  const locale = getBrowserLocale();
  return format(date, 'P', { locale: enAU });
};

/**
 * Get the dates of the week for a given date.
 * @param date - The date to get the week for.
 * @returns An array of SheetDate objects for the week.
 */
export const getDatesOfWeek = (date: Date): Date[] => {
  const monday = getMondayDate(date);
  return DaysOfWeek.map((day, index) => addDays(monday, index));
};

/**
 * Get the Monday of the week for a given date.
 * @param date - The date to get the Monday for.
 * @returns The Monday date.
 */
export const getMondayDate = (date: Date): Date => {
  return startOfWeek(date, { weekStartsOn: 1 });
};

/**
 * Convert a string representing a timestamp (from getTime) to a Date object.
 * @param timestampString - The string representing the timestamp.
 * @returns The Date object.
 */
export function timestampStringToDate(timestampString: string): Date {
  return parseISO(timestampString);
}

/**
 * Convert a date to a locale string.
 * @param date - The date to convert.
 * @param locale - The locale to use for formatting.
 * @returns The locale date string.
export const dateToLocaleString = (date: Date, locale = enAU): string => {
  return format(date, 'P', { locale });
};
};

/**
 * Format a date as a string in DDMMYYYY format.
 * @param date - The date to format.
 * @returns The formatted date string.
 */
export function formatDateDDMMYYYY(date: Date): string {
  return format(date, 'ddMMyyyy');
}
/**
 * Convert a date string in DDMMYYYY format back to a Date object.
 * @param dateString - The date string in DDMMYYYY format.
 * @returns The Date object.
 */
export function parseDateDDMMYYYY(dateString: string): Date {
    return parse(dateString, 'ddMMyyyy', new Date());
}

/**
 * Get date value with time set to 00:00:00.
 * @param date - The date to adjust.
 * @returns The adjusted date.
 */
export const getDateValue = (date: Date): Date => {
  return startOfDay(date);
};

/**
 * Compare dates without considering the time component.
 * @param date1 - The first date to compare.
 * @param date2 - The second date to compare.
 * @returns True if the dates are equal, false otherwise.
 */
export const compareDates = (date1: Date, date2: Date): boolean => {
  return isEqual(getDateValue(date1), getDateValue(date2));
};

