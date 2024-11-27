'use server';

import { error } from 'console';

import { getLoggedInUser } from './appwrite';
import {
  upsertTimeEntries,
  deleteTimeEntry,
  getTimeEntries,
} from '@/lib/utils/query';

import type { TimeEntryData, TimeEntryFormData } from '@/lib/types';

const generateTimeEntryId = (entry: TimeEntryFormData): string => {
  return `${entry.date.toISOString()}-${entry.clientId}-${entry.projectId}`;
};

export const saveEntries = async (
  entries: TimeEntryFormData[]
): Promise<TimeEntryData[] | undefined> => {
  console.log('entries', entries);

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
    id: generateTimeEntryId(entry),
  }));

  // Update the matched documents and create new ones
  await upsertTimeEntries(enrichedEntries, user.$id);
  return enrichedEntries;
};

export async function getEntries(
  startDate: Date,
  endDate: Date
): Promise<TimeEntryData[]> {
  if (!startDate || !endDate) {
    error('No start or end date provided');
    return [];
  }

  const user = await getLoggedInUser();
  if (!user) {
    error('User not logged in');
    return [];
  }

  const entries = await getTimeEntries(user.$id, {
    startDate,
    endDate,
  });

  return entries;
}

export const deleteEntry = async (entry: TimeEntryFormData): Promise<void> => {
  const id = generateTimeEntryId(entry);
  await deleteTimeEntry(id);
};
