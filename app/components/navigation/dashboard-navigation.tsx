import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Calendar, File, Users } from 'lucide-react';
import Link from 'next/link';
import { useSelectedLayoutSegment } from 'next/navigation';

const navItems = [
  {
    href: '/dashboard/timesheet',
    label: 'Timesheet',
    segment: 'timesheet',
    icon: Calendar,
  },
  {
    href: '/dashboard/reports',
    label: 'Reports',
    segment: 'reports',
    icon: File,
  },
  {
    href: '/dashboard/client-manager',
    label: 'Client Manager',
    segment: 'client-manager',
    icon: Users,
  },
];

export function DashboardNavigation(): JSX.Element {
  const currentSegment = useSelectedLayoutSegment();
  return (
    <div className="flex flex-col space-y-1">
      {navItems.map(item => (
        <Link href={item.href} key={item.segment}>
          <Button
            variant="ghost"
            className={cn(currentSegment === item.segment && 'bg-gray-100')}
          >
            <item.icon className="mr-2 size-4" />
            {item.label}
          </Button>
        </Link>
      ))}
    </div>
  );
}
