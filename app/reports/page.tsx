'use client';

import { PDFDownloadLink } from '@react-pdf/renderer';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { getDocumentsForDatesBetweenWithEmptyDates } from '@/lib/server/timesheet';
import { type TimeEntryData } from '@/lib/types/document-data.types';

import { TimesheetPDF } from '../components/timesheet-pdf';

// Simulated server action (in a real app, this would be in a separate file)
async function fetchTimesheetData(startDate: Date, endDate: Date) {
  // This is a placeholder. In a real application, you would fetch data from your backend.
  return [
    { client: 'Client A', hours: 10 },
    { client: 'Client B', hours: 15 },
    { client: 'Client C', hours: 8 },
  ];
}

export default function TimesheetReport() {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [reportData, setReportData] = useState<TimeEntryData[]>([]);

  const generateReport = async () => {
    try {
      const data = await getDocumentsForDatesBetweenWithEmptyDates(
        startDate,
        endDate
      );
      if (!data) {
        setReportData([]);
        return;
      }
      setReportData(data as TimeEntryData[]);
    } catch (error) {
      console.error('Failed to generate report:', error);
      setReportData([]);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Generate Timesheet Report</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between space-x-4">
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    className={`w-full justify-start text-left font-normal ${!startDate && 'text-muted-foreground'}`}
                    variant="outline"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate ? (
                      format(startDate, 'PPP')
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    initialFocus
                    mode="single"
                    selected={startDate}
                    onSelect={date => date && setStartDate(date)}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="w-full">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    className={`w-full justify-start text-left font-normal ${!endDate && 'text-muted-foreground'}`}
                    variant="outline"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate ? (
                      format(endDate, 'PPP')
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    initialFocus
                    mode="single"
                    selected={endDate}
                    onSelect={date => date && setEndDate(date)}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
          <Button className="w-full" onClick={generateReport}>
            Generate Report
          </Button>
          {reportData.length > 0 && (
            <PDFDownloadLink
              fileName="timesheet_report.pdf"
              document={
                <TimesheetPDF
                  data={reportData}
                  endDate={endDate}
                  startDate={startDate}
                />
              }
            >
              <Button className="w-full">Download PDF</Button>
            </PDFDownloadLink>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
