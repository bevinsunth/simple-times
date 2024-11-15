'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { signUpWithGithub } from '@/lib/server/auth';

export default function LoginForm() {
  const formSchema = z.object({
    email: z.string().email({
      message: 'Uh oh! This email address is invalid.',
    }),
    password: z
      .string()
      .min(8, {
        message: 'Password must be at least 8 characters.',
      })
      .regex(/[A-Z]/, {
        message: 'Password must contain at least one uppercase letter.',
      })
      .regex(/[a-z]/, {
        message: 'Password must contain at least one lowercase letter.',
      })
      .regex(/[0-9]/, {
        message: 'Password must contain at least one number.',
      }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  return (
    <Card className="mx-auto max-w-sm">
      <CardHeader>
        <CardTitle className="text-xl">Sign Up</CardTitle>
        <CardDescription>
          Enter your information to create an account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form>
            <FormField
              key="email"
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <FormLabel htmlFor="email">Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="mary@jane.com"
                          type="email"
                          {...field}
                          required
                        />
                      </FormControl>
                    </div>
                    <div className="grid gap-2">
                      <FormLabel htmlFor="password">Password</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Your strong password."
                          type="password"
                          {...field}
                          required
                        />
                      </FormControl>
                    </div>
                  </div>
                  <Button className="w-full" type="submit">
                    Create an account
                  </Button>
                  <Button
                    className="w-full"
                    type="button"
                    variant="outline"
                    onClick={async () => {
                      await signUpWithGithub();
                    }}
                  >
                    Sign up with GitHub
                  </Button>
                  <div className="mt-4 text-center text-sm">
                    Already have an account?{' '}
                    <Link className="underline" href="#">
                      Sign in
                    </Link>
                  </div>
                </FormItem>
              )}
            />
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
