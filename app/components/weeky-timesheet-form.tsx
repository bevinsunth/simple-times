'use client'

import React, { useState, useEffect } from 'react'
import {startOfWeek, endOfWeek, eachDayOfInterval, format } from 'date-fns'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { DropdownSelect } from './dropdown-select'
import { WeekSelector } from './week-selector'

interface Option {
  value: string;
  label: string;
}

interface Entry {
  client: string;
  project: string;
  hours: string;
}

interface Entries {
  [date: string]: Entry;
}

// Placeholder data for clients and projects
const clients: Option[] = [
  { value: "client1", label: "Client 1" },
  { value: "client2", label: "Client 2" },
  { value: "client3", label: "Client 3" },
]

const projects: Option[] = [
  { value: "project1", label: "Project 1" },
  { value: "project2", label: "Project 2" },
  { value: "project3", label: "Project 3" },
]

// Placeholder for actual API call
const saveTimesheet = async (data: Entries): Promise<void> => {
  console.log('Saving timesheet:', data)
  // Implement actual API call here
  return new Promise(resolve => setTimeout(resolve, 1000))
}

interface TimesheetFormProps {
  week: Date[];
    onSave: (entries: Entries) => void;
    initialEntries: Entries;
}

const TimesheetForm: React.FC<TimesheetFormProps> = ({ week, onSave, initialEntries }) => {
  const [entries, setEntries] = useState<Entries>(initialEntries)

  const handleInputChange = (date: string, field: keyof Entry, value: string) => {
    setEntries(prev => ({
      ...prev,
      [date]: {
        ...prev[date],
        [field]: value
      }
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(entries)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {week.map(date => {
        const formattedDate = format(date, 'yyyy-MM-dd')
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
                <Button type="button" onClick={() => console.log('Add more fields')}>+</Button>
              </div>
            </CardContent>
          </Card>
        )
      })}
      <Button type="submit" className="w-full">Save Timesheet</Button>
    </form>
  )
}

const SkeletonLoader: React.FC = () => {
  return (
    <div className="space-y-4">
      {Array.from({ length: 7 }).map((_, i) => (
        <Card key={i}>
          <CardHeader>
            <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, j) => (
                <div key={j} className="h-10 bg-gray-200 rounded"></div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

const Timesheet: React.FC = () => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date())
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    // Simulate loading delay
    const timer = setTimeout(() => setIsLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [currentDate])

  const weekStart = startOfWeek(currentDate)
  const weekEnd = endOfWeek(currentDate)
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd })

  const handleSave = async (data: Entries) => {
    setIsLoading(true)
    await saveTimesheet(data)
    setIsLoading(false)
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Weekly Timesheet</h1>
      <WeekSelector currentDate={currentDate} onDateChange={setCurrentDate} />
      {isLoading ? (
        <SkeletonLoader />
      ) : (
                  <TimesheetForm week={weekDays} onSave={handleSave} initialEntries={{}}/>
      )}
    </div>
  )
}

export { Timesheet }