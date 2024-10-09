import type {Week} from "@/types/index";
import {DaysOfWeek} from "@/types/constants";

export const getDatesOfCurrentWeek = (): Week[] => {
    const currentDate = new Date();
    const currentDay = currentDate.getDay();
    const diffToMonday = (currentDay + 6) % 7; // Calculate difference to Monday
    const monday = new Date(currentDate);
    monday.setDate(currentDate.getDate() - diffToMonday);

    const weekDates = DaysOfWeek.map((day, index) => {
        const date = new Date(monday);
        date.setDate(monday.getDate() + index);
        return {
            date: date,
            day: day
        };
    });

    return weekDates;
}