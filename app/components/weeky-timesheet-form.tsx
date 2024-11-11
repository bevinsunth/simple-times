'use client';

import React, { useState, useEffect } from 'react';
import { startOfWeek, endOfWeek, eachDayOfInterval, format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { DropdownSelect } from './dropdown-select';
import { WeekSelector } from './week-selector';
import { Entries, TimeEntry } from '@/lib/server/timesheet';
import { formatDateDDMMYYYY } from '@/lib/date-utils';

export interface Option {
  value: string;
  label: string;
}

// Placeholder for actual API call
const saveTimesheet = async (data: Entries): Promise<void> => {
  console.log('Saving timesheet:', data);
  // Implement actual API call here
  return new Promise((resolve) => setTimeout(resolve, 1000));
};

interface TimesheetFormProps {
  week: Date[];
  onSave: (entries: Entries) => void;
  initialEntries: Entries;
  clients: Option[];
  projects: Option[];
}

const TimesheetForm: React.FC<TimesheetFormProps> = ({
  week,
  onSave,
  initialEntries,
  clients,
  projects,
}) => {
  const [entries, setEntries] = useState<Entries>(initialEntries);

  const handleInputChange = (date: string, field: keyof TimeEntry, value: string) => {
    setEntries((prev) => ({
      ...prev,
      [date]: {
        ...prev[date],
        [field]: value,
      },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(entries);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {week.map((date) => {
        const formattedDate = formatDateDDMMYYYY(date);
        return (
          <Card key={formattedDate}>
            <CardHeader>
              <CardTitle>{format(date, 'EEEE, MMM d')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-4">
                <DropdownSelect
                  options={clients}
                  placeholder="Client"
                  value={entries[formattedDate]?.client || ''}
                  onChange={(value) => handleInputChange(formattedDate, 'client', value)}
                />
                <DropdownSelect
                  options={projects}
                  placeholder="Project"
                  value={entries[formattedDate]?.project || ''}
                  onChange={(value) => handleInputChange(formattedDate, 'project', value)}
                />
                <Input
                  type="number"
                  placeholder="Hours"
                  value={entries[formattedDate]?.hours || ''}
                  onChange={(e) => handleInputChange(formattedDate, 'hours', e.target.value)}
                  className="p-2 border rounded"
                />
                <Button type="button" onClick={() => console.log('Add more fields')}>
                  +
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
      <Button type="submit" className="w-full">
        Save Timesheet
      </Button>
    </form>
  );
};

export { TimesheetForm };
