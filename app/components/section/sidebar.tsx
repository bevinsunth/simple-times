import { Button } from '@/components/ui/button';
import { Calendar, Clock, Users } from 'lucide-react';
import Link from 'next/link';
import { getLoggedInUser } from '@/lib/utils/user';

import { AccountOptionsDropdown } from '../account-options-dropdown';

export async function Sidebar({
  className,
}: React.HTMLAttributes<HTMLDivElement>): Promise<JSX.Element> {
  const loggedInUser = await getLoggedInUser();
  return (
    <div className="sticky top-0 flex max-h-screen flex-col pb-12">
      <div className="grow space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold">Dashboard</h2>
          <div className="flex flex-col space-y-1">
            <Link href="/timesheet">
              <Button variant="ghost">
                <Calendar className="mr-2 size-4" />
                Timesheet
              </Button>
            </Link>
            <Link href="/reports">
              <Button variant="ghost">
                <Clock className="mr-2 size-4" />
                Reports
              </Button>
            </Link>
            <Link href="/client-manager">
              <Button variant="ghost">
                <Users className="mr-2 size-4" />
                Client Manager
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <div className="mt-auto px-3 py-2">
        {loggedInUser && <AccountOptionsDropdown user={loggedInUser} />}
      </div>
    </div>
  );
}
