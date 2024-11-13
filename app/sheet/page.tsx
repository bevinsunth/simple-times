'use client';

import { startOfWeek, endOfWeek, eachDayOfInterval, format } from 'date-fns';
import { se } from 'date-fns/locale';
import { useEffect, useState } from 'react';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { type Entries, saveEntries, getEntries } from '@/lib/server/timesheet';

import { WeekSelector } from '../components/week-selector';
import { TimesheetForm } from '../components/weeky-timesheet-form';

import type React from 'react';

interface Option {
  value: string;
  label: string;
}

// Placeholder data for clients and projects
const clients: Option[] = [
  { value: 'client1', label: 'Client 1' },
  { value: 'client2', label: 'Client 2' },
  { value: 'client3', label: 'Client 3' },
];

const projects: Option[] = [
  { value: 'project1', label: 'Project 1' },
  { value: 'project2', label: 'Project 2' },
  { value: 'project3', label: 'Project 3' },
];

const TimeSheet = () => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [entries, setEntries] = useState<Entries>({});
  const [weekDays, setWeekDays] = useState<Date[]>([]);

  useEffect(() => {
    const fetchEntries = async () => {
      setIsLoading(true);
      const weekDays = eachDayOfInterval({
        start: startOfWeek(currentDate),
        end: endOfWeek(currentDate),
      });
      setWeekDays(weekDays);
      setEntries(await getEntries(weekDays));
      setIsLoading(false);
    };
    fetchEntries();
  }, [currentDate]);

  const handleSave = async (data: Entries) => {
    setIsLoading(true);
    await saveEntries(data);
    setIsLoading(false);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Weekly Timesheet</h1>
      <WeekSelector currentDate={currentDate} onDateChange={setCurrentDate} />
      {isLoading ? (
        <SkeletonLoader />
      ) : (
        <TimesheetForm
          week={weekDays}
          onSave={handleSave}
          initialEntries={entries}
          clients={clients}
          projects={projects}
        />
      )}
    </div>
  );
};

const SkeletonLoader: React.FC = () => {
  return (
    <div className="space-y-4">
      {Array.from({ length: 7 }).map((_, i) => (
        <Card key={i}>
          <CardHeader>
            <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, j) => (
                <div key={j} className="h-10 bg-gray-200 rounded"></div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default TimeSheet;
