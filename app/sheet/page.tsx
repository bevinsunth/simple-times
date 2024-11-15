'use client';

import { startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';
import { useEffect, useState } from 'react';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import {
  saveEntries,
  getEntries,
  TimeSheetFormEntry,
} from '@/lib/server/timesheet';

import { WeekSelector } from '../components/week-selector';
import { TimesheetForm } from '../components/weeky-timesheet-form';
import { Sidebar } from '../components/sidebar';

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
  const [entries, setEntries] = useState<TimeSheetFormEntry[]>([]);
  const [weekDays, setWeekDays] = useState<Date[]>([]);

  useEffect(() => {
    const fetchEntries = async () => {
      setIsLoading(true);
      try {
        const weekDays = eachDayOfInterval({
          start: startOfWeek(currentDate),
          end: endOfWeek(currentDate),
        });
        setWeekDays(weekDays);
        setEntries(await getEntries(weekDays));
      } catch (error) {
        console.error('Failed to fetch entries:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEntries().catch(console.error);
  }, [currentDate]);

  const handleSave = (data: TimeSheetFormEntry[]) => {
    setIsLoading(true);
    saveEntries(data)
      .then(() => setIsLoading(false))
      .catch(error => {
        console.error('Failed to save entries:', error);
        setIsLoading(false);
      });
  };

  return (
    <div className="flex">
      <Sidebar className="w-64 border-r" />
      <div className="flex-1">
        <div className="container p-4">
          <h1 className="text-2xl font-bold mb-4">Weekly Timesheet</h1>
          <WeekSelector
            currentDate={currentDate}
            onDateChange={setCurrentDate}
          />
          {isLoading ? (
            <SkeletonLoader />
          ) : (
            <TimesheetForm
              clients={clients}
              initialEntries={entries}
              projects={projects}
              week={weekDays}
              onSave={handleSave}
            />
          )}
        </div>
      </div>
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
