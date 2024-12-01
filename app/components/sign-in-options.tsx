'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';

import { FaGithub } from 'react-icons/fa';

import { Button } from '@/components/ui/button';
import { Loader } from 'lucide-react';

export default function SignInOptions() {
  const [isGitHubLoading, setIsGitHubLoading] = useState(false);

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
        className="bg-inherit"
        onClick={() => signIn('credentials', { email: 'simple@example.com' })}
      >
        Just here to check the features
      </Button>
    </div>
  );
}
