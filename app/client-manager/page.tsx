'use client';

import ClientManager from '../components/section/client-manager';
import { Sidebar } from '../components/section/sidebar';

import type React from 'react';

const Home = (): JSX.Element => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1">
        <div className="flex min-h-screen items-center justify-center">
          <ClientManager />
        </div>
      </div>
    </div>
  );
};

export default Home;
