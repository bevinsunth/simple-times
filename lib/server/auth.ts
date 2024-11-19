'use server';

import { headers } from 'next/dist/client/components/headers';
import { redirect } from 'next/navigation';
import { OAuthProvider, Account, Client } from 'node-appwrite';

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT ?? '')
  .setProject(process.env.NEXT_APPWRITE_PROJECT ?? '');

export async function signInWithGithub(): Promise<void> {
  const account = new Account(client);
  const origin = headers().get('origin') ?? 'http://default-origin.com';

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  const redirectUrl = await account.createOAuth2Token(
    OAuthProvider.Github,
    `${origin}/oauth`,
    `${origin}/login`
  );
  return redirect(redirectUrl);
}
