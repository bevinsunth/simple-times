'use server';

import { error } from 'console';
import {
  upsertTimeEntries,
  deleteTimeEntry,
  getTimeEntries,
  getClients,
  getProjects,
  addClient,
  deleteClient,
  addProject,
  deleteProject,
} from '@/lib/utils/query';
import { getLoggedInUser } from '@/lib/utils/user';
import type {
  ClientAndProject,
  ClientData,
  ProjectData,
  TimeEntryData,
} from '@/lib/types';
import { Project } from '@prisma/client';

const generateTimeEntryId = (entry: TimeEntryData): string => {
  return `${entry.date.toISOString()}-${entry.clientId}-${entry.projectId}`;
};

export const saveEntries = async (
  entries: TimeEntryFormData[]
): Promise<TimeEntryData[] | undefined> => {
  console.log('entries', entries);

  const validEntries = entries.filter(entry => {
    const isValidHours =
      typeof entry.hours === 'number' && !isNaN(entry.hours) && entry.hours > 0;
    const isValidClient = entry.clientId.trim() !== '';
    const isValidProject = entry.projectId.trim() !== '';
    return isValidHours && isValidClient && isValidProject;
  });

  const userData = await getLoggedInUser();

  if (!userData) {
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
  await upsertTimeEntries(enrichedEntries, userData.id);
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

  const userData = await getLoggedInUser();
  if (!userData) {
    error('User not logged in');
    return [];
  }

  const entries = await getTimeEntries(userData.id, {
    startDate,
    endDate,
  });

  return entries;
}

export const deleteEntry = async (entry: TimeEntryData): Promise<void> => {
  const id = generateTimeEntryId(entry);
  await deleteTimeEntry(id);
};

export const getClientAndProjectList = async (): Promise<
  ClientAndProject[]
> => {
  const userData = await getLoggedInUser();
  if (!userData) {
    error('User not logged in');
    return [];
  }
  const clients = await getClients(userData.id);
  const projects = await Promise.all(
    clients.map(client => getProjects(client.id))
  );
  return clients.map((client, index) => ({
    client,
    projects: projects[index],
  }));
};

export const addNewClient = async (
  client: ClientData
): Promise<ClientData | undefined> => {
  const userData = await getLoggedInUser();
  if (!userData) {
    return;
  }
  const newClient = await addClient(client, userData.id);
  return newClient;
};

export const deleteExistingClient = async (id: string): Promise<void> => {
  console.log('deleteExistingClient', id);
  await deleteClient(id);
};

//add project when client is valid
export const addNewProject = async (project: ProjectData): Promise<Project> => {
  const newProject = await addProject(project);
  return newProject;
};
export const deleteExistingProject = async (id: string): Promise<void> => {
  console.log('deleteExistingProject', id);
  await deleteProject(id);
};