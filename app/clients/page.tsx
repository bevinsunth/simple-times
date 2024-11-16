'use client';

import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/app/components/data-table';
import { ClientDialog } from '@/app/components/client-dialog';
import { columns } from './columns';

export default function ClientsPage() {
  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Clients</h1>
        <ClientDialog>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Client
          </Button>
        </ClientDialog>
      </div>
      <DataTable columns={columns} data={[]} />
    </div>
  );
}
