import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Clock, Calendar } from 'lucide-react';
import Link from 'next/link';

export function Sidebar({
  className,
}: React.HTMLAttributes<HTMLDivElement>): JSX.Element {
  return (
    <div className={cn('pb-12 min-h-screen', className)}>
      <div className="space-y-4 py-4">
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
          </div>
        </div>
      </div>
    </div>
  );
}
