import { cookies } from 'next/headers';
import { NextResponse, NextRequest } from 'next/server';

import { createAdminClient } from '@/lib/server/appwrite';
import { SessionCookieName } from '../constants';

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get('userId');
  const secret = request.nextUrl.searchParams.get('secret');

  if (!userId || !secret) {
    throw new Error('Missing userId or secret');
  }

  const { account } = await createAdminClient();
  const session = await account.createSession(userId, secret);

  cookies().set(SessionCookieName, session.secret, {
    path: '/',
    httpOnly: true,
    sameSite: 'strict',
    secure: true,
  });

  return NextResponse.redirect(`${request.nextUrl.origin}`);
}
