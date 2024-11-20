'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useDebouncedCallback } from 'use-debounce';
import { PlusCircle, Trash2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { useEffect } from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { formatDateDDMMYYYY } from '@/lib/date-utils';
import { type TimeSheetFormEntry } from '@/lib/server/timesheet';
import { format } from 'date-fns';

const entrySchema = z.object({
  client: z.string().min(1, 'Client is required'),
  project: z.string().min(1, 'Project is required'),
  hours: z.string().refine(
    value => {
      if (value === '') {
        return true;
      }
      const hours = parseFloat(value);
      return !isNaN(hours) && hours >= 0 && hours <= 24;
    },
    {
      message: 'Hours must be a number between 0 and 24',
    }
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
  onSave: (entries: TimeSheetFormEntry[]) => Promise<void>;
  onDelete: (entry: TimeSheetFormEntry) => Promise<void>;
  initialEntries: TimeSheetFormEntry[];
  clients: Option[];
  projects: Option[];
}

const TimesheetForm = ({
  week,
  onSave,
  onDelete,
  initialEntries,
  clients,
  projects,
}: TimesheetFormProps): JSX.Element => {
  // First, prepare initial values including empty entries for each day
  const initialFormValues = {} as TimesheetSchema;

  // Initialize all week dates first
  week.forEach(date => {
    const dateKey = formatDateDDMMYYYY(date);
    initialFormValues[dateKey] = [{ client: '', project: '', hours: '' }];
  });

  // Then overlay existing entries
  initialEntries.forEach(entry => {
    if (!initialFormValues[entry.date]) {
      initialFormValues[entry.date] = []; // Ensure array exists
    }

    if (
      initialFormValues[entry.date].length === 1 &&
      !initialFormValues[entry.date][0].client
    ) {
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
    mode: 'all',
  });

  const handleAutoSave = useDebouncedCallback(async (): Promise<void> => {
    try {
      const data = form.getValues();
      const entries = Object.entries(data).flatMap(([date, dayEntries]) =>
        dayEntries
          .filter(entry => entry.client && entry.project && entry.hours)
          .map(entry => ({
            date,
            client: entry.client,
            project: entry.project,
            hours: entry.hours ?? '',
          }))
      );

      if (entries.length > 0) {
        await onSave(entries);
      }
    } catch (error) {
      console.error('Failed to auto-save:', error);
    }
  }, 1000); // 5 second delay

  useEffect(() => {
    const subscription = form.watch((value, { name, type }) => {
      if (name?.includes('.hours') && type === 'change') {
        const [dateKey, index] = name.split('.').slice(0, 2);
        void Promise.all([
          form.trigger(`${dateKey}.${index}.hours`),
          form.trigger(`${dateKey}.${index}.client`),
          form.trigger(`${dateKey}.${index}.project`),
        ]).then(([hoursValid, clientValid, projectValid]) => {
          if (hoursValid && clientValid && projectValid) {
            void handleAutoSave();
          }
        });
      }
    });

    return (): void => {
      subscription.unsubscribe();
    };
  }, [form, handleAutoSave]);

  const handleDeleteEntry = async (
    dateKey: string,
    index: number
  ): Promise<void> => {
    try {
      const entry = form.getValues(`${dateKey}.${index}`);
      await onDelete({ ...entry, date: dateKey } as TimeSheetFormEntry);
    } catch (error) {
      console.error('Failed to delete entry:', error);
    }
  };

  return (
    <>
      <Form {...form}>
        <form className="space-y-4">
          {week.map(date => {
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
                            <Select
                              defaultValue={field.value}
                              onValueChange={field.onChange}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select client" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {clients.map(client => (
                                  <SelectItem
                                    key={client.value}
                                    value={client.value}
                                  >
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
                            <Select
                              defaultValue={field.value}
                              onValueChange={field.onChange}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select project" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {projects.map(project => (
                                  <SelectItem
                                    key={project.value}
                                    value={project.value}
                                  >
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
                              <Input
                                {...field}
                                placeholder="Hours"
                                step="0.5"
                                type="number"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="flex items-end">
                        {index > 0 && (
                          <Button
                            size="icon"
                            type="button"
                            variant="ghost"
                            onClick={() => {
                              void handleDeleteEntry(dateKey, index);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                  <Button
                    className="mt-2 w-full"
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
                  >
                    <PlusCircle className="w-4 h-4 mr-2" />
                    Add Entry
                  </Button>
                </CardContent>
              </Card>
            );
          })}
          <Button className="w-full" type="submit">
            Save Timesheet
          </Button>
        </form>
      </Form>
    </>
  );
};

export { TimesheetForm };
