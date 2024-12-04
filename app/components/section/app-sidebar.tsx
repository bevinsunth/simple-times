'use client';

import { Calendar, Users, File } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';

const items: { url: string; title: string; segment: string; icon: React.FC }[] =
  [
    {
      url: '/dashboard/timesheet',
      title: 'Timesheet',
      segment: 'timesheet',
      icon: Calendar,
    },
    {
      url: '/dashboard/reports',
      title: 'Reports',
      segment: 'reports',
      icon: File,
    },
    {
      url: '/dashboard/client-manager',
      title: 'Client Manager',
      segment: 'client-manager',
      icon: Users,
    },
  ];

export function AppSidebar({
  footerContent,
}: {
  footerContent: React.ReactNode;
}) {
  return (
    <Sidebar className="p-5">
      <SidebarHeader className="text-primary text-lg font-bold">
        Dashboard
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="flex items-start">
              {items.map(item => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Button variant="ghost">
                      <item.icon />
                      {item.title}
                    </Button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>{footerContent}</SidebarFooter>
    </Sidebar>
  );
}
