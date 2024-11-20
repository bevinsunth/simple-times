import { SessionCookieName } from '@/app/constants';
import { cookies } from 'next/headers';
import { Account, Client, Databases, type Models } from 'node-appwrite';

export async function createSessionClient(): Promise<{
  account: Account | null;
}> {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT ?? '')
    .setProject(process.env.NEXT_APPWRITE_PROJECT ?? '');

  const session = cookies().get(SessionCookieName);
  if (!session?.value) {
    console.info('No session');
    return {
      account: null,
    };
  }

  client.setSession(session.value);
  return {
    get account(): Account {
      return new Account(client);
    },
  };
}

export async function createAdminClient(): Promise<{
  account: Account;
}> {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT ?? '')
    .setProject(process.env.NEXT_APPWRITE_PROJECT ?? '')
    .setKey(process.env.NEXT_APPWRITE_KEY ?? '');

  return {
    get account(): Account {
      return new Account(client);
    },
  };
}

export async function getLoggedInUser(): Promise<Models.User<Models.Document> | null> {
  try {
    const { account } = await createSessionClient();
    if (!account) {
      return null;
    }
    return await account.get();
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log('User not logged in user', error);
    return null;
  }
}

export function createDatabasesClient(): {
  databases: Databases;
} {
  const client = new Client()
    .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT ?? '')
    .setProject(process.env.NEXT_APPWRITE_PROJECT ?? '');
  return {
    get databases(): Databases {
      return new Databases(client);
    },
  };
}
