import { User } from '@prisma/client';
import { getCurrentUser } from '../session';
import { getUserByEmail } from './query';
import { db } from '../db';

//get logged in user
export const getLoggedInUser = async (): Promise<User | null> => {
  const user = await getCurrentUser();
  if (!user) {
    return null;
  }
  return await getUserByEmail(user.email as string);
};

export const createUser = async (user: User) => {
  await db.user.create({ data: user });
};
