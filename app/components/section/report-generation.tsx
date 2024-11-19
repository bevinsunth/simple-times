'use client';

import { useState } from 'react';
import { addDays, format, eachDayOfInterval } from 'date-fns';
import { CalendarIcon, Download, Loader2 } from 'lucide-react';
import { DateRange } from 'react-day-picker';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';
import { pdf } from '@react-pdf/renderer';
import TimesheetPDF from '../timesheet-pdf';
import { getEntries } from '@/lib/server/timesheet';

export default function ReportGeneration(): JSX.Element {
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 7),
  });
  const [isLoading, setIsLoading] = useState(false);
  const [report, setReport] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDownloadReport = async (): Promise<void> => {
    if (!date?.from || !date?.to) {
      setError('Please select a date range');
      return;
    }

    setIsLoading(true);
    setError(null);
    setReport(null);

    try {
      // Create array of all dates between start and end date
      const dateRange = eachDayOfInterval({
        start: date.from,
        end: date.to,
      });

      // Get entries for the date range
      const data = await getEntries(dateRange);

      if (!data || data.length === 0) {
        setError('No entries found for the selected date range');
        return;
      }

      if (data) {
        const reportContent = `Report for ${format(date.from, 'PPP')} to ${format(date.to, 'PPP')}`;
        setReport(reportContent);

        // Generate PDF blob
        const blob = await pdf(
          <TimesheetPDF data={data} startDate={date.from} endDate={date.to} />
        ).toBlob();

        // Create and download file
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `report-${format(date.from, 'yyyy-MM-dd')}-to-${format(date.to, 'yyyy-MM-dd')}.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } else {
        setError('No data available for the selected period');
      }
    } catch (err) {
      setError('Failed to generate and download report. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader>
        <CardTitle>Generate Report</CardTitle>
        <CardDescription>
          Select a period and generate a PDF report
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col space-y-2">
          <Label htmlFor="date-range">Date Range</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                id="date-range"
                variant={'outline'}
                className={cn(
                  'w-full justify-start text-left font-normal',
                  !date && 'text-muted-foreground'
                )}
                aria-label="Select date range"
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
        <Button
          className="w-full"
          onClick={handleDownloadReport}
          disabled={isLoading || !date?.from || !date?.to}
          aria-live="polite"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating Report
            </>
          ) : (
            <>
              <Download className="mr-2 h-4 w-4" />
              Download Report
            </>
          )}
        </Button>
      </CardContent>
      <CardFooter className="flex flex-col items-start">
        {error && (
          <Alert variant="destructive" className="mb-4 w-full" role="alert">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {report && (
          <Alert className="w-full mb-4" role="status">
            <AlertTitle>Report Generated</AlertTitle>
            <AlertDescription>{report}</AlertDescription>
          </Alert>
        )}
      </CardFooter>
    </Card>
  );
}
