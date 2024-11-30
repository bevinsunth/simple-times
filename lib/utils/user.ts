import { User } from '@prisma/client';
import { getCurrentUser } from '../session';
import { getUserByEmail } from './query';

//get logged in user
export const getLoggedInUser = async (): Promise<User | null> => {
  const user = await getCurrentUser();
  if (!user) {
    return null;
  }
  return await getUserByEmail(user.email as string);
};
