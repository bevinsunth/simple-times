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
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-[90%] max-w-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
            <Clock className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-3xl font-bold">
            Welcome to TimeTracker
          </CardTitle>
          <CardDescription className="text-lg mt-2">
            Simple, efficient time tracking for professionals
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <h3 className="font-semibold">Track Time</h3>
              <p className="text-sm text-muted-foreground">
                Log your hours easily with our intuitive interface
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">Generate Reports</h3>
              <p className="text-sm text-muted-foreground">
                Create detailed timesheets and reports in seconds
              </p>
            </div>
          </div>

          <div className="flex justify-center pt-4">
            <Link href="/timesheet">
              <Button size="lg" className="group">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Home;
