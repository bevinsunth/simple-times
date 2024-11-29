'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Clock, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const Home = (): JSX.Element => {
  return (
    <div className="bg-background flex min-h-screen items-center justify-center">
      <Card className="w-[90%] max-w-2xl">
        <CardHeader className="text-center">
          <div className="bg-primary/10 mx-auto mb-4 flex size-12 items-center justify-center rounded-full">
            <Clock className="text-primary size-6" />
          </div>
          <CardTitle className="text-3xl font-bold">
            Welcome to TimeTracker
          </CardTitle>
          <CardDescription className="mt-2 text-lg">
            Simple, efficient time tracking for professionals
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h3 className="font-semibold">Track Time</h3>
              <p className="text-muted-foreground text-sm">
                Log your hours easily with our intuitive interface
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">Generate Reports</h3>
              <p className="text-muted-foreground text-sm">
                Create detailed timesheets and reports in seconds
              </p>
            </div>
          </div>

          <div className="flex justify-center pt-4">
            <Link href="/timesheet">
              <Button size="lg" className="group">
                Get Started
                <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Home;
