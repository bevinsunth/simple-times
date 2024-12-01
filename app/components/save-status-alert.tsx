import React, { useEffect, useState } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react';

const alertVariants = cva(
  'fixed top-5 left-1/2 transform -translate-x-1/2 flex items-center space-x-2 rounded-full px-4 py-2 shadow-lg transition-all duration-300 ease-in-out',
  {
    variants: {
      variant: {
        default: 'bg-background border border-border',
        saving: 'bg-blue-50 border border-blue-200',
        saved: 'bg-green-50 border border-green-200',
        error: 'bg-red-50 border border-red-200',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

export interface SaveStatusAlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {
  status: 'idle' | 'saving' | 'saved' | 'error';
}

const SaveStatusAlert: React.FC<SaveStatusAlertProps> = ({
  className,
  status,
  ...props
}) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Reset visibility when status changes
    setVisible(true);

    // Don't set timer for error or idle status
    if (status === 'error' || status === 'idle') return;

    // Set timer for other statuses
    const timer = setTimeout(() => {
      setVisible(false);
    }, 5000);

    return (): void => clearTimeout(timer);
  }, [status]);

  if (status === 'idle' || !visible) return null;

  return (
    <div
      className={cn(
        alertVariants({
          variant: status,
          className,
        }),
        'animate-in slide-in-from-top-2'
      )}
      role="status"
      aria-live="polite"
      {...props}
    >
      {status === 'saving' && (
        <>
          <Loader2 className="size-4 animate-spin text-blue-500" />
          <span className="text-sm font-medium text-blue-700">Saving...</span>
        </>
      )}
      {status === 'saved' && (
        <>
          <CheckCircle className="size-4 text-green-500" />
          <span className="text-sm font-medium text-green-700">Saved</span>
        </>
      )}
      {status === 'error' && (
        <>
          <AlertCircle className="size-4 text-red-500" />
          <span className="text-sm font-medium text-red-700">Error saving</span>
        </>
      )}
    </div>
  );
};

export default SaveStatusAlert;
