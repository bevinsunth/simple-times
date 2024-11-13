'use client';

import React, { useEffect } from 'react';
import { format } from 'date-fns';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TimeSheetFormEntry } from '@/lib/server/timesheet';
import { formatDateDDMMYYYY } from '@/lib/date-utils';
import { PlusCircle, Trash2 } from 'lucide-react';
const entrySchema = z.object({
  client: z.string(),
  project: z.string(),
  hours: z
    .string()
    .optional()
    .transform((val) => val?.trim())
    .refine((val) => !val || /^\d+(\.\d{1,2})?$/.test(val), 'Invalid hours format')
    .refine(
      (val) => {
        if (!val) return true;
        const num = parseFloat(val);
        return !isNaN(num) && num > 0 && num <= 24;
      },
      {
        message: 'Hours must be between 0 and 24',
      },
    ),
});

const dailyEntriesSchema = z.array(entrySchema);

const timesheetSchema = z.record(dailyEntriesSchema);

type TimesheetSchema = z.infer<typeof timesheetSchema>;

interface Option {
  value: string;
  label: string;
}

interface TimesheetFormProps {
  week: Date[];
  onSave: (entries: TimeSheetFormEntry[]) => void;
  initialEntries: TimeSheetFormEntry[];
  clients: Option[];
  projects: Option[];
}

const TimesheetForm = ({ week, onSave, initialEntries, clients, projects }: TimesheetFormProps) => {
  console.log('initial entries', initialEntries);
  // First, prepare initial values including empty entries for each day
  const initialFormValues = {} as TimesheetSchema;

  // Initialize all week dates first
  week.forEach((date) => {
    const dateKey = formatDateDDMMYYYY(date);
    initialFormValues[dateKey] = [{ client: '', project: '', hours: '' }];
  });

  // Then overlay existing entries
  initialEntries.forEach((entry) => {
    if (!initialFormValues[entry.date]) {
      initialFormValues[entry.date] = []; // Ensure array exists
    }

    if (initialFormValues[entry.date].length === 1 && !initialFormValues[entry.date][0].client) {
      // Replace the empty entry
      initialFormValues[entry.date] = [
        {
          client: entry.client,
          project: entry.project,
          hours: entry.hours,
        },
      ];
    } else {
      // Add to existing entries
      initialFormValues[entry.date].push({
        client: entry.client,
        project: entry.project,
        hours: entry.hours,
      });
    }
  });

  const form = useForm<TimesheetSchema>({
    resolver: zodResolver(timesheetSchema),
    defaultValues: initialFormValues,
  });

  const onSubmit = async (data: TimesheetSchema) => {
    const entries = Object.entries(data).flatMap(([date, dayEntries]) =>
      dayEntries.map((entry) => ({
        date,
        client: entry.client,
        project: entry.project,
        hours: entry.hours ?? '',
      })),
    );
    console.log('entries', entries);
    onSave(entries);
  };

  console.log('form values', form.watch());

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {week.map((date) => {
          const dateKey = formatDateDDMMYYYY(date);
          return (
            <Card key={dateKey}>
              <CardHeader>
                <CardTitle>{format(date, 'EEEE, MMM d')}</CardTitle>
              </CardHeader>
              <CardContent>
                {form.watch(dateKey)?.map((_, index) => (
                  <div key={index} className="grid grid-cols-4 gap-4 mb-4">
                    <FormField
                      control={form.control}
                      name={`${dateKey}.${index}.client`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Client</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select client" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {clients.map((client) => (
                                <SelectItem key={client.value} value={client.value}>
                                  {client.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`${dateKey}.${index}.project`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Project</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select project" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {projects.map((project) => (
                                <SelectItem key={project.value} value={project.value}>
                                  {project.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`${dateKey}.${index}.hours`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Hours</FormLabel>
                          <FormControl>
                            <Input {...field} type="number" step="0.01" placeholder="Hours" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex items-end">
                      {index > 0 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            const currentEntries = form.getValues(dateKey);
                            form.setValue(
                              dateKey,
                              currentEntries.filter((_, i) => i !== index),
                            );
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    const dateKey = formatDateDDMMYYYY(date);
                    const currentEntries = form.getValues(dateKey) || [];
                    form.setValue(dateKey, [
                      ...currentEntries,
                      { client: '', project: '', hours: '' },
                    ]);
                  }}
                  className="mt-2 w-full"
                >
                  <PlusCircle className="w-4 h-4 mr-2" />
                  Add Entry
                </Button>
              </CardContent>
            </Card>
          );
        })}
        <Button type="submit" className="w-full">
          Save Timesheet
        </Button>
      </form>
    </Form>
  );
};

export { TimesheetForm };
