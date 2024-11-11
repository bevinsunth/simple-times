'use server';

import { ID, Query } from 'node-appwrite';

import type { TimeEntryData, TimeEntryDocument } from '@/lib/types/document-data.types';

import { formatDateDDMMYYYY, getDateValue } from '../date-utils';
import { GetDbOperations } from './databases';
import { getLoggedInUser } from './appwrite';
import { error } from 'console';

export interface TimeEntry {
  client: string;
  project: string;
  hours: string;
}

export interface Entries {
  [date: string]: TimeEntry;
}

export const saveEntries = async (entries: Entries) => {
  // remove any entries with invalid date or hours value
  const validEntries = Object.keys(entries).reduce((acc, date) => {
    const entry = entries[date];
    const isValidHours = !isNaN(parseInt(entry.hours)) && parseInt(entry.hours) > 0;
    const isValidClient = entry.client.trim() !== '';
    const isValidProject = entry.project.trim() !== '';
    if (isValidHours && isValidClient && isValidProject) {
      acc[date] = {
        ...entry,
        hours: parseInt(entry.hours).toString(),
      };
    }
    return acc;
  }, {} as Entries);

  const timeEntryCollection = await GetDbOperations<TimeEntryDocument>('timeEntry');
  const user = await getLoggedInUser();

  if (user === null) {
    error('User not logged in');
    return [];
  }

  const timeEntryDataArray: TimeEntryData[] = Object.entries(validEntries).map(
    ([key, entry]: [string, TimeEntry]) => ({
      date: getDateValue(new Date(key)),
      client: entry.client,
      project: entry.project,
      hours: parseInt(entry.hours),
      timeEntryIdentifier: getUniqueTimeEntryIdentifier(new Date(key), entry.client, entry.project),
    }),
  );

  if (timeEntryDataArray.length === 0) {
    error('No valid entries to save');
    return;
  }

  //get all the matching documents
  const matchedDocuments = await timeEntryCollection.query([
    Query.equal('userId', user.$id),
    Query.or(
      timeEntryDataArray.map((entry) =>
        Query.equal('timeEntryIdentifier', entry.timeEntryIdentifier),
      ),
    ),
  ]);

  //update the matched documents and create new documents for the ones that are not matched
  const promises = timeEntryDataArray.map(async (entry) => {
    const document = matchedDocuments.documents.find(
      (doc) => doc.timeEntryIdentifier === entry.timeEntryIdentifier,
    );
    if (document) {
      document.hours = entry.hours;
      document.date = entry.date;
      document.client = entry.client;
      document.project = entry.project;
      document.userId = user.$id;
      await timeEntryCollection.update(document.$id, document);
    } else {
      await timeEntryCollection.create(ID.unique(), { ...entry, userId: user.$id });
    }
  });
};

export async function getEntries(dates: Date[]): Promise<Entries> {
  const timeEntryCollection = await GetDbOperations<TimeEntryDocument>('timeEntry');
  const user = await getLoggedInUser();

  if (user === null) {
    error('User not logged in');
    return {};
  }

  const timeEntryDocuments = await timeEntryCollection.query([
    Query.equal('userId', user.$id),
    Query.or(
      dates.map((date) => Query.startsWith('timeEntryIdentifier', formatDateDDMMYYYY(date))),
    ),
  ]);

  console.log('timeEntryDocuments', timeEntryDocuments);

  const entries: Entries = {};

  timeEntryDocuments.documents.forEach((doc) => {
    const date = formatDateDDMMYYYY(doc.date);
    if (!entries[date]) {
      entries[date] = {
        client: doc.client,
        project: doc.project,
        hours: doc.hours.toString(),
      };
    }
  });

  console.log('entries', entries);

  return entries;
}

const getUniqueTimeEntryIdentifier = (date: Date, client: string, project: string): string => {
  return `${formatDateDDMMYYYY(date)}-${client}-${project}`;
};
