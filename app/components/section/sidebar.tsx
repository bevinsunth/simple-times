import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, Users } from 'lucide-react';
import Link from 'next/link';

import { AccountOptionsDropdown } from '../account-options-dropdown';

export function Sidebar({
  className,
}: React.HTMLAttributes<HTMLDivElement>): JSX.Element {
  return (
    <div className={cn('pb-12 min-h-screen flex flex-col', className)}>
      <div className="space-y-4 py-4 flex-grow">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold">Dashboard</h2>
          <div className="space-y-1">
            <Link href="/">
              <Button variant="ghost" className="w-full justify-start">
                <Calendar className="mr-2 h-4 w-4" />
                Timesheet
              </Button>
            </Link>
            <Link href="/reports">
              <Button variant="ghost" className="w-full justify-start">
                <Clock className="mr-2 h-4 w-4" />
                Reports
              </Button>
            </Link>
            <Link href="/client-manager">
              <Button variant="ghost" className="w-full justify-start">
                <Users className="mr-2 h-4 w-4" />
                Client Manager
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <div className="mt-auto px-3 py-2">
        <AccountOptionsDropdown />
      </div>
    </div>
  );
}
