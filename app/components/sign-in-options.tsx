'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';

import { FaGithub, FaGoogle } from 'react-icons/fa';

import { Button } from '@/components/ui/button';
import { Loader, FlaskConical } from 'lucide-react';

export default function SignInOptions() {
  const [isGitHubLoading, setIsGitHubLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isTestUserLoading, setIsTestUserLoading] = useState(false);

  return (
    <div className="grid grid-cols-1 gap-3">
      <Button
        variant="outline"
        onClick={() => {
          setIsGitHubLoading(true);
          signIn('github');
        }}
      >
        {isGitHubLoading ? (
          <Loader className="mr-2 size-4 animate-spin" />
        ) : (
          <FaGithub className="mr-2 size-4" />
        )}
        Github
      </Button>
      <Button
        variant="outline"
        onClick={() => {
          setIsGoogleLoading(true);
          signIn('google');
        }}
      >
        {isGoogleLoading ? (
          <Loader className="mr-2 size-4 animate-spin" />
        ) : (
          <FaGoogle className="mr-2 size-4" />
        )}
        Google
      </Button>
      <Button
        variant="outline"
        onClick={() => {
          setIsTestUserLoading(true);
          signIn('credentials', { email: 'simple@example.com' });
        }}
      >
        {isTestUserLoading ? (
          <Loader className="mr-2 size-4 animate-spin" />
        ) : (
          <>
            <FlaskConical className="mr-2 size-4" />
            Log in as Test User
          </>
        )}
      </Button>
    </div>
  );
}
