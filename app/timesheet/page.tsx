'use client';

import TimeSheet from '../components/section/timesheet';
import { Sidebar } from '../components/section/sidebar';

import type React from 'react';

const Home = (): JSX.Element => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="container p-4">
        <TimeSheet />
      </div>
    </div>
  );
};

export default Home;
