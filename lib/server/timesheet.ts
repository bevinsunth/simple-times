'use server';

import { error } from 'console';

import { getLoggedInUser } from './appwrite';
import {
  upsertTimeEntries,
  deleteTimeEntry,
  getTimeEntries,
} from '@/lib/utils/query';

import type { TimeEntryData, TimeEntryFormData } from '@/lib/types';

export const saveEntries = async (
  entries: TimeEntryFormData[]
): Promise<TimeEntryData[] | undefined> => {
  const validEntries = entries.filter(entry => {
    const isValidHours = !isNaN(entry.hours) && entry.hours > 0;
    const isValidClient = entry.clientId.trim() !== '';
    const isValidProject = entry.projectId.trim() !== '';
    return isValidHours && isValidClient && isValidProject;
  });

  const user = await getLoggedInUser();

  if (!user) {
    error('User not logged in');
    return [];
  }

  if (validEntries.length === 0) {
    error('No valid entries to save');
    return;
  }

  const enrichedEntries = validEntries.map(entry => ({
    ...entry,
    id: getUniqueTimeEntryIdentifier(entry),
  }));

  // Update the matched documents and create new ones
  await upsertTimeEntries(enrichedEntries, user.$id);
};

export async function getEntries(
  startDate: Date,
  endDate: Date
): Promise<TimeEntryData[]> {
  if (startDate === undefined || endDate === undefined) {
    error('No start or end date provided');
    return [];
  }

  const user = await getLoggedInUser();
  if (user === null) {
    error('User not logged in');
    return [];
  }

  const entries = await getTimeEntries(user.$id, {
    startDate: startDate,
    endDate: endDate,
  });

  return entries;
}

export const deleteEntry = async (id: string): Promise<void> => {
  await deleteTimeEntry(id);
};

const getUniqueTimeEntryIdentifier = (entry: TimeEntryFormData): string => {
  return `${entry.date.toISOString()}-${entry.clientId}-${entry.projectId}`;
};
