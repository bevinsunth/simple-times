'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useDebouncedCallback } from 'use-debounce';
import { PlusCircle, Trash2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
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
import { formatDateDDMMYYYY, parseDateDDMMYYYY } from '@/lib/utils/date';
import { format } from 'date-fns';
import { TimeEntryData } from '@/lib/types';

const entrySchema = z.object({
  clientId: z.string().min(1, 'Client is required'),
  projectId: z.string().min(1, 'Project is required'),
  hours: z.string().refine(
    value => {
      if (value === '') {
        return true;
      }
      const hours = parseFloat(value);
      return !isNaN(hours) && hours >= 0 && hours <= 24;
    },
    {
      message: 'hours must be a number between 0 and 24',
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
  onSave: (entries: TimeEntryData[]) => Promise<void>;
  onDelete: (entry: TimeEntryData) => Promise<void>;
  initialEntries: TimeEntryData[];
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
    initialFormValues[dateKey] = [{ clientId: '', projectId: '', hours: '' }];
  });

  // Then overlay existing entries
  initialEntries.forEach(entry => {
    const dateKey = formatDateDDMMYYYY(entry.date);
    const dateEntries = initialFormValues[dateKey];

    if (!dateEntries) {
      initialFormValues[dateKey] = []; // Ensure array exists
    }

    const newEntry = {
      clientId: entry.clientId,
      projectId: entry.projectId,
      hours: String(entry.hours),
    };

    if (dateEntries?.length === 1 && !dateEntries[0].clientId) {
      // Replace the empty entry
      initialFormValues[dateKey] = [newEntry];
    } else {
      // Add to existing entries
      initialFormValues[dateKey]?.push(newEntry);
    }
  });

  const form = useForm<TimesheetSchema>({
    resolver: zodResolver(timesheetSchema),
    defaultValues: initialFormValues,
    mode: 'all',
  });

  const handleSave = useDebouncedCallback(async (): Promise<void> => {
    const data = form.getValues();
    const entries = Object.entries(data).flatMap(([date, dayEntries]) =>
      dayEntries
        .filter(entry => entry.clientId && entry.projectId && entry.hours)
        .map(entry => ({
          date: parseDateDDMMYYYY(date),
          clientId: entry.clientId,
          projectId: entry.projectId,
          hours: parseFloat(entry.hours),
        }))
    );

    if (entries.length > 0) {
      await onSave(entries as TimeEntryData[]);
    }
  });

  // useEffect(() => {
  //   const subscription = form.watch((value, { name, type }) => {
  //     if (name?.includes('.hours') && type === 'change') {
  //       const [dateKey, index] = name.split('.').slice(0, 2);
  //       void Promise.all([
  //         form.trigger(`${dateKey}.${index}.hours`),
  //         form.trigger(`${dateKey}.${index}.clientId`),
  //         form.trigger(`${dateKey}.${index}.projectId`),
  //       ]).then(([hoursValid, clientValid, projectValid]) => {
  //         if (hoursValid && clientValid && projectValid) {
  //           void handleAutoSave();
  //         }
  //       });
  //     }
  //   });

  //   return (): void => {
  //     subscription.unsubscribe();
  //   };
  // }, [form, handleAutoSave]);

  const handleDeleteEntry = async (
    dateKey: string,
    index: number
  ): Promise<void> => {
    const entry = form.getValues(`${dateKey}.${index}`);
    await onDelete({
      clientId: entry.clientId,
      projectId: entry.projectId,
      hours: parseFloat(entry.hours),
      date: parseDateDDMMYYYY(dateKey),
    } as TimeEntryData);
    // Remove entry at specific index
    const currentEntries = form.getValues(dateKey) || [];
    const updatedEntries = currentEntries.filter((_, i) => i !== index);
    form.setValue(dateKey, updatedEntries);
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
                    <div key={index} className="mb-4 grid grid-cols-4 gap-4">
                      <FormField
                        control={form.control}
                        name={`${dateKey}.${index}.clientId`}
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
                        name={`${dateKey}.${index}.projectId`}
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
                            <Trash2 className="size-4" />
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
                        { clientId: '', projectId: '', hours: '' },
                      ]);
                    }}
                  >
                    <PlusCircle className="mr-2 size-4" />
                    Add Entry
                  </Button>
                </CardContent>
              </Card>
            );
          })}
          <div className="sticky bottom-5 left-0 w-full m-15 p-5 z-10">
            <Button
              className="w-full justify-center"
              type="submit"
              onClick={e => {
                e.preventDefault();
                void handleSave();
              }}
            >
              Save Timesheet
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};

export { TimesheetForm };
