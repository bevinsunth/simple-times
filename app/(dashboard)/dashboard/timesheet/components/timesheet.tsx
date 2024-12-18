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
import { FormControl, FormItem } from '@/components/ui/form';
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
  { key: 'client1', value: 'Client 1' },
  { key: 'client2', value: 'Client 2' },
  { key: 'client3', value: 'Client 3' },
];
const projects = [
  { key: 'project1', value: 'Project 1' },
  { key: 'project2', value: 'Project 2' },
  { key: 'project3', value: 'Project 3' },
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
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'rows',
  });

  const onSubmit = (data: any) => {
    console.log(data);
  };

  const handleSelectChange = (index: number, value: string) => {
    console.log(index, value);
  };

  const handleHoursChange = (
    index: number,
    dayIndex: number,
    value: string
  ) => {
    console.log(index, dayIndex, value);
  };

  const handleNotesChange = (
    index: number,
    dayIndex: number,
    value: string
  ) => {
    console.log(index, dayIndex, value);
  };

  return (
    <FormProvider {...form}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Clients</TableHead>
                <TableHead>Projects</TableHead>
                {weekDays.map(day => (
                  <TableHead key={day.date}>{day.day}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {fields.map((field, index) => (
                <TableRow>
                  <TableCell>
                    <FormField
                      control={form.control}
                      name={`rows.${index}.client`}
                      render={({ field }) => (
                        <FormItem>
                          <Select
                            onValueChange={value =>
                              handleSelectChange(index, value)
                            }
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select Client" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {clients.map(option => (
                                <SelectItem
                                  key={option.key}
                                  value={option.value}
                                >
                                  {option.value}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                  </TableCell>

                  <TableCell>
                    <FormField
                      control={form.control}
                      name={`rows.${index}.project`}
                      render={({ field }) => (
                        <FormItem>
                          <Select
                            onValueChange={value =>
                              handleSelectChange(index, value)
                            }
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select Client" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {projects.map(option => (
                                <SelectItem
                                  key={option.key}
                                  value={option.value}
                                >
                                  {option.value}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                  </TableCell>

                  {weekDays.map((day, dayIndex) => (
                    <TableCell key={day.date}>
                      <div className="flex flex-row gap-1">
                        <FormField
                          control={form.control}
                          name={`rows.${index}.timeEntries.${dayIndex}.hours`}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  type="number"
                                  value={field.value}
                                  onChange={e =>
                                    handleHoursChange(
                                      index,
                                      dayIndex,
                                      e.target.value
                                    )
                                  }
                                  className="h-8 w-full"
                                  placeholder="Enter hours"
                                />
                              </FormControl>
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
                                  <Button
                                    variant="outline"
                                    size="icon"
                                    className="size-8 shrink-0"
                                  >
                                    <Notebook className="size-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[425px]">
                                  <DialogHeader>
                                    <DialogTitle>
                                      Notes for {day.date}
                                    </DialogTitle>
                                  </DialogHeader>
                                  <Textarea
                                    value={field.value}
                                    onChange={e =>
                                      handleNotesChange(
                                        index,
                                        dayIndex,
                                        e.target.value
                                      )
                                    }
                                    placeholder="Enter notes"
                                    className="min-h-[100px]"
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
