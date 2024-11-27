import { User } from '@prisma/client';
import { getCurrentUser } from '../session';
import { getUserByEmail } from './query';
import { warn } from 'console';

//get logged in user
export const getLoggedInUser = async (): Promise<User | null> => {
  const user = await getCurrentUser();
  if (!user) {
    warn('User not logged in');
    return null;
  }
  return await getUserByEmail(user.email as string);
};
