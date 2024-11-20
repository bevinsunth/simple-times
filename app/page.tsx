'use client';

import TimeSheet from './components/section/timesheet';
import { Sidebar } from './components/sidebar';

import type React from 'react';

const Home = (): JSX.Element => {
  return (
    <div className="flex">
      <Sidebar className="w-64 border-r" />
      <div className="flex-1">
        <div className="container p-4">
          <TimeSheet />
        </div>
      </div>
    </div>
  );
};

export default Home;
