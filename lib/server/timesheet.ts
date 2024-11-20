'use server';

import { error } from 'console';

import { ID, Query } from 'node-appwrite';

import { formatDateDDMMYYYY, parseDateDDMMYYYY } from '@/lib/date-utils';

import { getLoggedInUser } from './appwrite';
import { GetDbOperations } from './databases';

import type {
  TimeEntryData,
  TimeEntryDocument,
  TimeEntryDocumentData,
} from '@/lib/types/document-data.types';

export interface TimeSheetFormEntry {
  date: string;
  client: string;
  project: string;
  hours: string;
  notes?: string;
}

export const saveEntries = async (
  entries: TimeSheetFormEntry[]
): Promise<TimeEntryData[] | undefined> => {
  const validEntries = entries.filter(entry => {
    const isValidHours =
      !isNaN(parseFloat(entry.hours)) && parseFloat(entry.hours) > 0;
    const isValidClient = entry.client.trim() !== '';
    const isValidProject = entry.project.trim() !== '';
    return isValidHours && isValidClient && isValidProject;
  });

  console.log('validEntries', validEntries);

  const timeEntryCollection =
    await GetDbOperations<TimeEntryDocument>('timeEntry');
  const user = await getLoggedInUser();

  if (user === null) {
    error('User not logged in');
    return [];
  }

  const timeEntryDataArray: TimeEntryData[] = validEntries.map(entry => ({
    date: parseDateDDMMYYYY(entry.date),
    client: entry.client,
    project: entry.project,
    hours: parseInt(entry.hours),
    timeEntryIdentifier: getUniqueTimeEntryIdentifier(
      entry.date,
      entry.client,
      entry.project
    ),
  }));

  if (timeEntryDataArray.length === 0) {
    error('No valid entries to save');
    return;
  }

  //get all the matching documents
  const matchedDocuments = await timeEntryCollection.query([
    // Always filter by the current user
    Query.equal('userId', user.$id),

    // Add timeEntryIdentifier filters based on array length
    ...(() => {
      if (timeEntryDataArray.length > 1) {
        // Multiple entries - use OR condition to match any identifier
        return [
          Query.or(
            timeEntryDataArray.map(entry =>
              Query.equal('timeEntryIdentifier', entry.timeEntryIdentifier)
            )
          ),
        ];
      } else if (timeEntryDataArray.length === 1) {
        // Single entry - directly match the identifier
        return [
          Query.equal(
            'timeEntryIdentifier',
            timeEntryDataArray[0].timeEntryIdentifier
          ),
        ];
      }
      // Empty array - no additional filters
      return [];
    })(),
  ]);

  //update the matched documents and create new documents for the ones that are not matched
  const promises = timeEntryDataArray.map(async entry => {
    const document = matchedDocuments.documents.find(
      doc => doc.timeEntryIdentifier === entry.timeEntryIdentifier
    );
    if (document) {
      const updatedData: TimeEntryDocumentData = {
        userId: document.userId,
        timeEntryIdentifier: document.timeEntryIdentifier,
        hours: entry.hours,
        date: entry.date,
        client: entry.client,
        project: entry.project,
      };
      await timeEntryCollection.update(document.$id, updatedData);
    } else {
      await timeEntryCollection.create(ID.unique(), {
        ...entry,
        userId: user.$id,
      } as TimeEntryDocumentData);
    }
  });

  await Promise.all(promises);
};

export async function getEntries(dates: Date[]): Promise<TimeSheetFormEntry[]> {
  console.log('dates', dates);
  const timeEntryCollection =
    await GetDbOperations<TimeEntryDocument>('timeEntry');
  const user = await getLoggedInUser();

  if (user === null) {
    error('User not logged in');
    return [];
  }

  const response = await timeEntryCollection.query([
    Query.equal('userId', user.$id),
    Query.or(
      dates.map(date =>
        Query.startsWith('timeEntryIdentifier', formatDateDDMMYYYY(date))
      )
    ),
  ]);

  console.log('response', response);

  const entries: TimeSheetFormEntry[] = response.documents.map(doc => ({
    date: formatDateDDMMYYYY(new Date(doc.date)),
    client: doc.client,
    project: doc.project,
    hours: doc.hours.toString(),
  }));

  return entries;
}

export const deleteEntry = async (entry: TimeSheetFormEntry): Promise<void> => {
  const timeEntryCollection =
    await GetDbOperations<TimeEntryDocument>('timeEntry');
  const user = await getLoggedInUser();

  if (user === null) {
    error('User not logged in');
    return;
  }

  console.log(entry);

  const response = await timeEntryCollection.query([
    Query.equal('userId', user.$id),
    Query.equal(
      'timeEntryIdentifier',
      getUniqueTimeEntryIdentifier(entry.date, entry.client, entry.project)
    ),
  ]);

  const document = response.documents[0];

  await timeEntryCollection.delete(document.$id);
};

const getUniqueTimeEntryIdentifier = (
  date: string,
  client: string,
  project: string
): string => {
  return `${date}-${client}-${project}`;
};
