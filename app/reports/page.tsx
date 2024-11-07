'use client'

import { useState } from 'react'
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { TimesheetPDF } from "../components/timesheet-pdf"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { format } from "date-fns"
import { getDocumentsForDatesBetweenWithEmptyDates } from '@/lib/server/timesheet'
import { TimeEntryData } from '@/lib/types/document-data.types'

// Simulated server action (in a real app, this would be in a separate file)
async function fetchTimesheetData(startDate: Date, endDate: Date) {
    // This is a placeholder. In a real application, you would fetch data from your backend.
    return [
        { client: 'Client A', hours: 10 },
        { client: 'Client B', hours: 15 },
        { client: 'Client C', hours: 8 },
    ]
}



export default function TimesheetReport() {
    const [startDate, setStartDate] = useState(new Date())
    const [endDate, setEndDate] = useState(new Date())
    const [reportData, setReportData] = useState<TimeEntryData[]>([])

    const generateReport = async () => {
        const data = await await getDocumentsForDatesBetweenWithEmptyDates(startDate, endDate)
        setReportData(data)
    }

    return (
        <Card className="w-full max-w-md mx-auto">
            <CardHeader>
                <CardTitle>Generate Timesheet Report</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="flex justify-between space-x-4">
                        <div className="w-full">
                            <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant={"outline"}
                                        className={`w-full justify-start text-left font-normal ${!startDate && "text-muted-foreground"}`}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {startDate ? format(startDate, "PPP") : <span>Pick a date</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                        mode="single"
                                        selected={startDate}
                                        onSelect={(date) => date && setStartDate(date)}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                        <div className="w-full">
                            <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button
                                        variant={"outline"}
                                        className={`w-full justify-start text-left font-normal ${!endDate && "text-muted-foreground"}`}
                                    >
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0">
                                    <Calendar
                                        mode="single"
                                        selected={endDate}
                                        onSelect={(date) => date && setEndDate(date)}
                                        initialFocus
                                    />
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>
                    <Button onClick={generateReport} className="w-full">Generate Report</Button>
                    {reportData && (
                        <PDFDownloadLink
                            document={<TimesheetPDF data={reportData} startDate={startDate} endDate={endDate} />}
                            fileName="timesheet_report.pdf"
                        >
                            <Button className="w-full">
                            </Button>
                        </PDFDownloadLink>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}