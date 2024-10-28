import {DaysOfWeek} from "@/types/constants";

export interface SheetDate {
    date: Date;
    localeDateString: string;
    day: typeof DaysOfWeek[number];
  }
