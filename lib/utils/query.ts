import { Client, Project, User } from '@prisma/client/edge';
import { TimeEntryData } from '../types';
import { db } from '@/lib/db';
//ToDo: Add cache strategy

//Query for time entries
export const getTimeEntries = async (
  userId: string,
  dates: { startDate: Date; endDate: Date }
): Promise<TimeEntryData[]> => {
  const timeEntries = await db.timeEntry.findMany({
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
  const newTimeEntries = await db.$transaction(
    timeEntries.map(entry =>
      db.timeEntry.upsert({
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
  const newUser = await db.user.create({ data: user });
  return newUser;
};

//Add client
export const addClient = async (client: Client): Promise<Client> => {
  const newClient = await db.client.create({ data: client });
  return newClient;
};

//Delete client
export const deleteClient = async (id: string): Promise<void> => {
  await db.client.delete({ where: { id } });
};

//Add project
export const addProject = async (project: Project): Promise<Project> => {
  const newProject = await db.project.create({ data: project });
  return newProject;
};

//Delete project
export const deleteProject = async (id: string): Promise<void> => {
  await db.project.delete({ where: { id } });
};

//Get user by email
export const getUserByEmail = async (email: string): Promise<User | null> => {
  const user = await db.user.findUnique({ where: { email } });
  return user;
};
