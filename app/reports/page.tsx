import ReportGeneration from '../components/section/report-generation';
import { Sidebar } from '../components/section/sidebar';

import type React from 'react';

const Home = (): JSX.Element => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <div className="flex min-h-screen items-center justify-center">
          <ReportGeneration />
        </div>
      </div>
    </div>
  );
};

export default Home;
