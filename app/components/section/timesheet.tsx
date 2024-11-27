'use client';

import { Card, CardContent, CardHeader } from '@/components/ui/card';

import { WeekSelector } from '../week-selector-dropdown';
import { TimesheetForm } from '../timesheet-form';

import type React from 'react';
import { useClientStore, useTimesheetStore } from '@/lib/client/store';
import { useEffect } from 'react';
import { TimeEntryData } from '@/lib/types';
import SaveStatusAlert from '../save-status-alert';

const TimeSheet: React.FC = () => {
  const {
    currentDate,
    isLoading,
    isSaving,
    entries,
    weekDays,
    setCurrentDate,
    deleteEntry,
    saveEntries,
  } = useTimesheetStore();

  const { clientAndProjectList, fetchClientAndProjectList } = useClientStore();

  const handleSave = async (data: TimeEntryData[]): Promise<void> => {
    await saveEntries(data);
  };

  const handleDelete = async (entry: TimeEntryData): Promise<void> => {
    await deleteEntry(entry);
  };

  useEffect(() => {
    setCurrentDate(new Date());
  }, [setCurrentDate]);

  useEffect(() => {
    fetchClientAndProjectList();
  }, [fetchClientAndProjectList]);

  const clients = clientAndProjectList.map(item => ({
    value: item.client.id ?? '',
    label: item.client.name,
  }));
  const projects = clientAndProjectList
    .map(item =>
      item.projects.map(project => ({
        value: project.id ?? '',
        label: project.name,
      }))
    )
    .flat();

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
