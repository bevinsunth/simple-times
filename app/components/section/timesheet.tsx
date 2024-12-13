'use client';

import { WeekSelector } from '../week-selector-dropdown';
import { TimesheetForm } from '../timesheet-form';

import type React from 'react';
import { useClientStore, useTimesheetStore } from '@/lib/client/store';
import { useEffect } from 'react';
import { TimeEntryData } from '@/lib/types';
import SaveStatusAlert from '../save-status-alert';
import { Spinner } from '../spinner';
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

  //redirect to client manager if no client or project
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
        clientId: item.client.id ?? '',
      }))
    )
    .flat();

  return (
    <>
      <WeekSelector currentDate={currentDate} onDateChange={setCurrentDate} />
      {isLoading ? (
        <Spinner />
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

export default TimeSheet;
