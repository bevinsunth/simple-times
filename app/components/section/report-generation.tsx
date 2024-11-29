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
import { getEntries, getClientAndProjectList } from '@/lib/utils/operations';
import { getClients } from '@/lib/utils/query';

export default function ReportGeneration(): JSX.Element {
  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 7),
  });
  const [isLoading, setIsLoading] = useState(false);
  const [report, setReport] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generatePDF = async (
    data: any,
    startDate: Date,
    endDate: Date
  ): Promise<void> => {
    try {
      const clients = await getClientAndProjectList();
      const enrichedData = data.map(entry => ({
        ...entry,
        clientName: clients.find(client => client.client.id === entry.clientId)
          ?.client.name,
        projectName: clients
          .find(client => client.client.id === entry.clientId)
          ?.projects.find(project => project.id === entry.projectId)?.name,
      }));

      const reportContent = `Report for ${format(startDate, 'PPP')} to ${format(endDate, 'PPP')}`;
      setReport(reportContent);

      // Generate PDF blob
      const blob = await pdf(
        <TimesheetPDF
          data={enrichedData}
          startDate={startDate}
          endDate={endDate}
        />
      ).toBlob();

      // Create and download file
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `report-${format(startDate, 'yyyy-MM-dd')}-to-${format(endDate, 'yyyy-MM-dd')}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating PDF:', error);
      setError('Failed to generate the report. Please try again.');
    }
  };

  const handleDownloadReport = async (): Promise<void> => {
    if (!date?.from || !date?.to) {
      setError('Please select a date range');
      return;
    }

    setIsLoading(true);
    setError(null);
    setReport(null);

    try {
      // Get entries for the date range
      const data = await getEntries(date.from, date.to);

      if (!data || data.length === 0) {
        setError('No entries found for the selected date range');
        return;
      }

      if (data) {
        await generatePDF(data, date.from, date.to);
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
    <Card className="mx-auto w-full max-w-lg">
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
                <CalendarIcon className="mr-2 size-4" />
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
          onClick={() => void handleDownloadReport()}
          disabled={isLoading || !date?.from || !date?.to}
          aria-live="polite"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              Generating Report
            </>
          ) : (
            <>
              <Download className="mr-2 size-4" />
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
          <Alert className="mb-4 w-full" role="status">
            <AlertTitle>Report Generated</AlertTitle>
            <AlertDescription>{report}</AlertDescription>
          </Alert>
        )}
      </CardFooter>
    </Card>
  );
}
