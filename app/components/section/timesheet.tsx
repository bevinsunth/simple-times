'use client';

import { useEffect } from 'react';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { saveEntries, TimeSheetFormEntry } from '@/lib/server/timesheet';

import { WeekSelector } from '../week-selector-dropdown';
import { TimesheetForm } from '../timesheet-form';

import type React from 'react';
import { useTimesheetStore } from '@/lib/client/timesheet';
import SaveStatusAlert from '../save-status-alert';

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

const TimeSheet: React.FC = () => {
  const {
    currentDate,
    isLoading,
    isSaving,
    entries,
    weekDays,
    setCurrentDate,
    fetchEntries,
    setEntries,
    deleteEntry,
  } = useTimesheetStore();

  useEffect(() => {
    void fetchEntries();
  }, [fetchEntries]);

  const handleSave = async (data: TimeSheetFormEntry[]): Promise<void> => {
    await saveEntries(data);
    setEntries(data);
  };

  const handleDelete = async (entry: TimeSheetFormEntry): Promise<void> => {
    await deleteEntry(entry);
  };

  return (
    <>
      <WeekSelector currentDate={currentDate} onDateChange={setCurrentDate} />
      {isLoading ? (
        <SkeletonLoader />
      ) : (
        <TimesheetForm
          key={currentDate.toISOString()}
          clients={clients}
          initialEntries={entries}
          projects={projects}
          week={weekDays}
          onSave={handleSave}
          onDelete={handleDelete}
        />
      )}
      {isSaving !== 'idle' && <SaveStatusAlert status={isSaving} />}
    </>
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
