'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Github, Loader } from 'lucide-react';
import { signIn } from 'next-auth/react';
import { useState } from 'react';

export default function LoginPage(): JSX.Element {
  const [isGitHubLoading, setIsGitHubLoading] = useState<boolean>(false);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-[380px]">
        <CardHeader className="space-y-1">
          <CardTitle className="text-center text-2xl">
            Welcome to SimpleTimes
          </CardTitle>
          <CardDescription className="text-center">
            Choose your preferred sign in method
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
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
        </CardContent>
      </Card>
    </div>
  );
}
