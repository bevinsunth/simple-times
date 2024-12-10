import ClientManager from '@/app/components/section/client-manager';

import type React from 'react';

const Home = (): JSX.Element => {
  return (
    <div className="flex items-center justify-center">
      <ClientManager />
    </div>
  );
};

export default Home;
