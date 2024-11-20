'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { FaDiscord, FaMicrosoft, FaGoogle, FaGithub } from 'react-icons/fa';
import { signInWithGithub } from '@/lib/server/auth';
import { startTransition } from 'react';

export default function LoginPage(): JSX.Element {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-[380px]">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">
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
                startTransition(() => {
                  void signInWithGithub();
                });
              }}
            >
              <FaGithub className="mr-2 h-4 w-4" />
              Github
            </Button>
            {/* <Button variant="outline">
              <FaGoogle className="mr-2 h-4 w-4" />
              Google
            </Button>
            <Button variant="outline">
              <FaDiscord className="mr-2 h-4 w-4" />
              Discord
            </Button>
            <Button variant="outline">
              <FaMicrosoft className="mr-2 h-4 w-4" />
              Microsoft
            </Button> */}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
