import type {SheetDate} from "@/types/index";
import {DaysOfWeek} from "@/types/constants";

export const getDatesOfWeek = (date: Date): SheetDate[] => {
    const day = date.getDay();
    const diffToMonday = (day + 6) % 7; // Calculate difference to Monday
    const monday = new Date(date);
    monday.setDate(date.getDate() - diffToMonday);

    const weekDates = DaysOfWeek.map((day, index) => {
        const date = new Date(monday);
        date.setDate(monday.getDate() + index);
        return {
            date: date,
            day: day,
            localeDateString: dateToLocaleString(date),   
        };
    });

    return weekDates;
}


//Function that gets the moday of the week
export const getMondayDate = (date: Date) => {
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
    return new Date(date.setDate(diff));
};

//Function to convert time to a date
export const timestampToDate = (timestamp: string) => {
    return new Date(timestamp);
};

export const dateToDayString = (date: Date) => {
    return new Intl.DateTimeFormat(navigator.language, { weekday: 'long' }).format(date);
}

//TODo: Change to dynamic locale
//Make can cause hydration issue
export const dateToLocaleString = (date: Date, locale: string = 'en-AU') => {
    return new Intl.DateTimeFormat(locale).format(date);
}

