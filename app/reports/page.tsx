'use client';

import { PDFDownloadLink } from '@react-pdf/renderer';
import { format, eachDayOfInterval } from 'date-fns';
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
import { getEntries } from '@/lib/server/timesheet';
import { type TimeSheetFormEntry } from '@/lib/server/timesheet';
import TimesheetPDF from '@/app/components/timesheet-pdf';
import { DatePickerWithRange } from '../components/date-range-selector';
import { DateRange } from 'react-day-picker';
import { cn } from '@/lib/utils';

// Simulated server action (in a real app, this would be in a separate file)
async function fetchTimesheetData(startDate: Date, endDate: Date) {
  // This is a placeholder. In a real application, you would fetch data from your backend.
  return [
    { client: 'Client A', hours: 10 },
    { client: 'Client B', hours: 15 },
    { client: 'Client C', hours: 8 },
  ];
}

const DatePicker = ({
  date,
  setDate,
}: {
  date: DateRange | undefined;
  setDate: (date: DateRange | undefined) => void;
}) => {
  return (
    <div className="grid gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={'outline'}
            className={cn(
              'w-[300px] justify-start text-left font-normal',
              !date && 'text-muted-foreground'
            )}
          >
            <CalendarIcon />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, 'LLL dd, y')} -{' '}
                  {format(date.to, 'LLL dd, y')}
                </>
              ) : (
                format(date.from, 'LLL dd, y')
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
    </div>
  );
};

export default function TimesheetReport() {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [reportData, setReportData] = useState<TimeSheetFormEntry[]>([]);

  const generateReport = async () => {
    try {
      // Create array of all dates between start and end date
      const dateRange = eachDayOfInterval({
        start: startDate,
        end: endDate,
      });

      // Get entries for the date range
      const data = await getEntries(dateRange);

      if (!data) {
        setReportData([]);
        return;
      }
      setReportData(data);
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
          <DatePicker
            date={{ from: startDate, to: endDate }}
            setDate={date => {
              setStartDate(date?.from ?? new Date());
              setEndDate(date?.to ?? new Date());
            }}
          />
          <Button className="w-full" onClick={() => void generateReport()}>
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
