"use client"

import * as React from "react"
import { addDays, format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { getDocumentsForDatesBetween } from "@/lib/server/timesheet"
import { PDFDownloadLink } from "@react-pdf/renderer"
import PDFReport from '../components/pdfreport'

const Reports = ({
    className,
}: React.HTMLAttributes<HTMLDivElement>) => {
    const [date, setDate] = React.useState<DateRange | undefined>({
        from: addDays(new Date(), -7),
        to: new Date(),
    });

    const [timesheetData, setTimesheetData] = React.useState<any[]>([]);

    const OnClick = async (from: Date, to: Date) => {
        const documents = await getDocumentsForDatesBetween(from, to)
        setTimesheetData(documents)
    }

    return (
        <div className={cn("grid gap-2", className)}>
            <Popover>
                <PopoverTrigger asChild>
                    <Button
                        id="date"
                        variant={"outline"}
                        className={cn(
                            "w-[300px] justify-start text-left font-normal",
                            !date && "text-muted-foreground"
                        )}
                    >
                        <CalendarIcon />
                        {date?.from ? (
                            date.to ? (
                                <>
                                    {format(date.from, "LLL dd, y")} -{" "}
                                    {format(date.to, "LLL dd, y")}
                                </>
                            ) : (
                                format(date.from, "LLL dd, y")
                            )
                        ) : (
                            <span>Pick a date</span>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={date?.from}
                        selected={date}
                        onSelect={setDate}
                        numberOfMonths={2}
                    />
                </PopoverContent>
            </Popover>

            <div className="flex justify-center p-5">
                <Button size={"lg"} className="bg-primary" onClick={() => date?.from && date?.to && OnClick(date.from, date.to)}>Submit</Button>
            </div>
            {timesheetData.length > 0 && (
                <div>
                    <h1>Timesheet Report</h1>
                    <PDFDownloadLink
                        document={<PDFReport timesheetData={timesheetData} />}
                        fileName="Timesheet_Report.pdf"
                    >
                        <Button>Download</Button>
                    </PDFDownloadLink>
                </div>
            )}
        </div>
    )
}

export default Reports