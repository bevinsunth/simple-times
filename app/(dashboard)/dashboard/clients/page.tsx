import ClientManager from '@/app/components/section/client-manager';
import { ContentLayout } from '@/components/admin-panel/content-layout';
import { Link } from 'lucide-react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

import type React from 'react';

const Home = (): JSX.Element => {
  return (
    <>
      <ContentLayout title="Clients">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Clients</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </ContentLayout>
      <div className="flex min-h-screen items-center justify-center">
        <ClientManager />
      </div>
    </>
  );
};

export default Home;
