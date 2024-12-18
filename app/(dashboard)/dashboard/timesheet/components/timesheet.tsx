'use client';

import { useForm, useFieldArray, Form, FormProvider } from 'react-hook-form';
import { any, z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { FormControl, FormItem, FormMessage } from '@/components/ui/form';
import { FormField } from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Notebook } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { useEffect } from 'react';

export interface WeekDay {
  day: string;
  date: string;
}

const hoursEntrySchema = z.object({
  hours: z
    .number()
    .min(0, 'Hours must be at least 0')
    .max(24, 'Hours must be less than 24'),
  notes: z.string().optional(),
});

const timeEntryRowSchema = z.object({
  client: z.string().min(1, 'Client is required'),
  project: z.string().min(1, 'Project is required'),
  timeEntries: z.array(hoursEntrySchema),
});

// Define schema for the entire form
const schema = z.object({
  rows: z.array(timeEntryRowSchema),
});

const clients = [
  { value: 'client1', label: 'Client 1' },
  { value: 'client2', label: 'Client 2' },
  { value: 'client3', label: 'Client 3' },
];
const projects = [
  { value: 'project1', label: 'Project 1' },
  { value: 'project2', label: 'Project 2' },
  { value: 'project3', label: 'Project 3' },
];

// Define the type for form values
export type FormValues = z.infer<typeof schema>;

function Timesheet({ weekDays }: { weekDays: WeekDay[] }) {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      rows: [
        {
          client: '',
          project: '',
          timeEntries: [],
        },
      ],
    },
    mode: 'onChange',
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'rows',
  });

  const onSubmit = (data: FormValues) => {
    console.log('data', data);
  };

  const formValues = form.watch();

  useEffect(() => {
    console.log('formValues', formValues);
    console.log('errors', form.formState.errors);
  }, [formValues, form.formState.errors]);

  return (
    <FormProvider {...form}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-left">Clients</TableHead>
                <TableHead className="text-left">Projects</TableHead>
                {weekDays.map(day => (
                  <TableHead className="text-left">{day.day}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {fields.map((field, index) => (
                <TableRow key={field.id}>
                  <TableCell colSpan={1}>
                    <div>
                      <FormField
                        control={form.control}
                        name={`rows.${index}.client`}
                        render={({ field }) => (
                          <FormItem>
                            <Select
                              defaultValue={field.value}
                              onValueChange={field.onChange}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select Client" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {clients.map(option => (
                                  <SelectItem value={option.value}>
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />
                    </div>
                  </TableCell>

                  <TableCell colSpan={1}>
                    <div className="min-w-15">
                      <FormField
                        control={form.control}
                        name={`rows.${index}.project`}
                        render={({ field }) => (
                          <FormItem>
                            <Select
                              defaultValue={field.value}
                              onValueChange={field.onChange}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select Client" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {projects.map(option => (
                                  <SelectItem value={option.value}>
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormItem>
                        )}
                      />
                    </div>
                  </TableCell>
                  {weekDays.map((day, dayIndex) => (
                    <TableCell key={dayIndex} colSpan={1}>
                      <div className="flex min-w-20 flex-row p-1">
                        <FormField
                          control={form.control}
                          name={`rows.${index}.timeEntries.${dayIndex}.hours`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  type="number"
                                  className="w-full"
                                  placeholder="Enter hours"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name={`rows.${index}.timeEntries.${dayIndex}.notes`}
                          render={({ field }) => (
                            <FormItem>
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="ghost" className="size-10">
                                    <Notebook />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px]">
                                  <DialogHeader>
                                    <DialogTitle>
                                      Notes for {day.date}
                                    </DialogTitle>
                                  </DialogHeader>
                                  <Textarea
                                    placeholder="Enter notes"
                                    className="min-h-[100px]"
                                    {...field}
                                  />
                                </DialogContent>
                              </Dialog>
                            </FormItem>
                          )}
                        />
                      </div>
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </form>
      </Form>
    </FormProvider>
  );
}

export default Timesheet;
