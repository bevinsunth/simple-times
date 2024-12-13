import { Loader2 } from 'lucide-react';

export const Spinner = () => {
  return (
    <div className="flex min-h-screen justify-center">
      <Loader2 className="my-80 size-12 animate-spin" />
    </div>
  );
};
