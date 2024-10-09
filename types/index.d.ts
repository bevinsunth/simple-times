import {DaysOfWeek} from "@/types/constants";

export interface Week {
    date: Date;
    day: typeof DaysOfWeek[number];
  }
  
  export interface ColumnProps {
    title: string;
  }
  
export interface TableProps {
    title: string;
    columns: ColumnProps[];
    rows: React.ReactNode[][];
}