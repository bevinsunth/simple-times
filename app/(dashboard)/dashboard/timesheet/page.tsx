'use client';

import { ContentLayout } from '@/components/admin-panel/content-layout';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import Timesheet, { WeekDay } from './components/timesheet';
import type React from 'react';
import { useState } from 'react';
import { WeekSelectorDropdown } from './components/week-selector-dropdown';
import {
  dateToDayString,
  dateToLocaleString,
  getDatesOfWeek,
} from '@/lib/utils/date';

const getWeekDays = (date: Date): WeekDay[] => {
  return getDatesOfWeek(date).map(date => ({
    day: dateToDayString(date),
    date: dateToLocaleString(date),
  }));
};

const Home = (): JSX.Element => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [weekDays, setWeekDays] = useState<WeekDay[]>(getWeekDays(currentDate));

  const handleDateChange = (date: Date) => {
    setCurrentDate(date);
    setWeekDays(getWeekDays(date));
  };

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
      <div className="mx-auto w-full p-3">
        <WeekSelectorDropdown
          currentDate={currentDate}
          onDateChange={handleDateChange}
        />
        <Timesheet weekDays={weekDays} />
      </div>
    </>
  );
};

export default Home;
