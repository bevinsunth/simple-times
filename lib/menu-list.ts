import { Sheet, SquarePen, LucideIcon, UserPlus } from 'lucide-react';

type Submenu = {
  href: string;
  label: string;
  active?: boolean;
};

type Menu = {
  href: string;
  label: string;
  active?: boolean;
  icon: LucideIcon;
  submenus?: Submenu[];
};

type Group = {
  groupLabel: string;
  menus: Menu[];
};

export function getMenuList(pathname: string): Group[] {
  return [
    {
      groupLabel: 'Tracking',
      menus: [
        {
          href: '/dashboard/timesheet',
          label: 'Timesheet',
          icon: Sheet,
          submenus: [],
        },
        {
          href: '/dashboard/clients',
          label: 'Clients',
          icon: UserPlus,
          submenus: [],
        },
      ],
    },
    {
      groupLabel: 'Reporting',
      menus: [
        {
          href: '/dashboard/reports',
          label: 'Reports',
          icon: SquarePen,
        },
      ],
    },
  ];
}
