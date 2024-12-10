import TimeSheet from '@/app/components/section/timesheet';
import { ContentLayout } from '@/components/admin-panel/content-layout';
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
      <ContentLayout title="Timesheet">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Timesheet</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </ContentLayout>
      <div className="mx-auto max-w-screen-lg p-3">
        <TimeSheet />
      </div>
    </>
  );
};

export default Home;
