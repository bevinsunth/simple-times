'use client';

import { PDFDownloadLink, pdf } from '@react-pdf/renderer';
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
import { DateRange } from 'react-day-picker';
import { cn } from '@/lib/utils';

const DatePicker = ({
  date,
  setDate,
}: {
  date: DateRange | undefined;
  setDate: (date: DateRange | undefined) => void;
}): JSX.Element => {
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
            <CalendarIcon className="mr-2 h-4 w-4" />
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

export default function TimesheetReport(): JSX.Element {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [reportData, setReportData] = useState<TimeSheetFormEntry[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const generateAndDownloadPDF = async (): Promise<void> => {
    setIsGenerating(true);
    try {
      // Create array of all dates between start and end date
      const dateRange = eachDayOfInterval({
        start: startDate,
        end: endDate,
      });

      // Get entries for the date range
      const data = await getEntries(dateRange);

      if (!data || data.length === 0) {
        alert('No entries found for the selected date range');
        return;
      }

      setReportData(data);

      // Generate PDF blob
      const blob = await pdf(
        <TimesheetPDF data={data} startDate={startDate} endDate={endDate} />
      ).toBlob();

      // Create download link and trigger download
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `timesheet_${format(startDate, 'yyyy-MM-dd')}_${format(
        endDate,
        'yyyy-MM-dd'
      )}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to generate report:', error);
      alert('Failed to generate PDF report');
    } finally {
      setIsGenerating(false);
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
          <Button
            className="w-full"
            onClick={() => void generateAndDownloadPDF()}
            disabled={isGenerating}
          >
            {isGenerating ? 'Generating PDF...' : 'Generate & Download Report'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
