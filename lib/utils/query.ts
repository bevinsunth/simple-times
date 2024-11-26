import { Client, Project, User } from '@prisma/client/edge';
import prisma from '../db';
import { TimeEntryData } from '../types';

//ToDo: Add cache strategy

//Query for time entries
export const getTimeEntries = async (
  userId: string,
  dates: { startDate: Date; endDate: Date }
): Promise<TimeEntryData[]> => {
  const timeEntries = await prisma.timeEntry.findMany({
    where: { userId, date: { gte: dates.startDate, lte: dates.endDate } },
  });
  return timeEntries;
};

//Upsert multiple time entries
export const upsertTimeEntries = async (
  timeEntries: TimeEntryData[],
  userId: string
): Promise<TimeEntryData[]> => {
  const now = new Date();

  // Use transaction to ensure all operations succeed or none do
  const newTimeEntries = await prisma.$transaction(
    timeEntries.map(entry =>
      prisma.timeEntry.upsert({
        where: { id: entry.id },
        update: {
          ...entry,
          userId: userId,
          updatedAt: now,
        },
        create: {
          ...entry,
          userId: userId,
          createdAt: now,
          updatedAt: now,
        },
      })
    )
  );

  return newTimeEntries;
};

// Keep the single upsert for convenience
export const upsertTimeEntry = async (
  timeEntry: TimeEntryData,
  userId: string
): Promise<TimeEntryData> => {
  return (await upsertTimeEntries([timeEntry], userId))[0];
};

//Delete time entry
export const deleteTimeEntry = async (id: string): Promise<void> => {
  await prisma.timeEntry.delete({ where: { id } });
};

//Add user
export const addUser = async (user: User): Promise<User> => {
  const newUser = await prisma.user.create({ data: user });
  return newUser;
};

//Add client
export const addClient = async (client: Client): Promise<Client> => {
  const newClient = await prisma.client.create({ data: client });
  return newClient;
};

//Delete client
export const deleteClient = async (id: string): Promise<void> => {
  await prisma.client.delete({ where: { id } });
};

//Add project
export const addProject = async (project: Project): Promise<Project> => {
  const newProject = await prisma.project.create({ data: project });
  return newProject;
};

//Delete project
export const deleteProject = async (id: string): Promise<void> => {
  await prisma.project.delete({ where: { id } });
};
