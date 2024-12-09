import ClientManager from '@/app/components/section/client-manager';

import type React from 'react';

const Home = (): JSX.Element => {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <ClientManager />
    </div>
  );
};

export default Home;
