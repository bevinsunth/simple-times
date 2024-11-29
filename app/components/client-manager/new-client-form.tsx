'use client';

import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';

const clientSchema = z.object({
  name: z.string().min(1, 'Client name is required').max(100),
});

type ClientFormValues = z.infer<typeof clientSchema>;

interface NewClientFormProps {
  onAddClient: (name: string) => Promise<void>;
}

export function NewClientForm({ onAddClient }: NewClientFormProps) {
  const form = useForm<ClientFormValues>({
    resolver: zodResolver(clientSchema),
    defaultValues: { name: '' },
  });

  const handleSubmit = async (data: ClientFormValues) => {
    await onAddClient(data.name.trim());
    form.reset();
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="flex space-x-2"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormControl>
                <Input placeholder="New client name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">
          <PlusCircle className="mr-2 size-4" />
          Add Client
        </Button>
      </form>
    </Form>
  );
}
