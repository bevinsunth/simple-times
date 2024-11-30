'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';

import { Github, Loader } from 'lucide-react';

import { Button } from '@/components/ui/button';

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
          <Github className="mr-2 size-4" />
        )}{' '}
        Github
      </Button>
    </div>
  );
}
