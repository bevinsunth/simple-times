import '../globals.css';

import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/app/components/section/app-sidebar';
import { SessionProvider } from 'next-auth/react';
import { getCurrentUser } from '@/lib/session';
import { notFound } from 'next/navigation';
import { UserAccountNav } from '../components/user-account-nav';

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): Promise<JSX.Element> {
  const user = await getCurrentUser();

  if (!user) {
    return notFound();
  }

  return (
    <SidebarProvider>
      <AppSidebar
        footerContent={
          <UserAccountNav
            user={{
              name: user.name ?? '',
              image: user.image ?? '',
              email: user.email ?? '',
            }}
          />
        }
      />
      <main className="flex flex-1">
        <SidebarTrigger className="sticky top-2 p-4" />
        <div className="flex-1 p-4">{children}</div>
      </main>
    </SidebarProvider>
  );
}
