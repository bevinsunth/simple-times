'use client'

import React, { useState, useEffect } from 'react'
import { addWeeks, subWeeks, startOfWeek, endOfWeek, eachDayOfInterval, format } from 'date-fns'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Placeholder for actual API call
const saveTimesheet = async (data) => {
    console.log('Saving timesheet:', data)
    // Implement actual API call here
    return new Promise(resolve => setTimeout(resolve, 1000))
}

const WeekSelector = ({ currentDate, onDateChange }) => {
    return (
        <div className="flex items-center justify-between mb-4">
            <Button onClick={() => onDateChange(subWeeks(currentDate, 1))}>Previous Week</Button>
            <Select
                value={format(currentDate, 'yyyy-MM-dd')}
                onValueChange={(value) => onDateChange(new Date(value))}
            >
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select a week" />
                </SelectTrigger>
                <SelectContent>
                    {Array.from({ length: 52 }, (_, i) => {
                        const date = subWeeks(new Date(), i)
                        return (
                            <SelectItem key={i} value={format(date, 'yyyy-MM-dd')}>
                                {format(date, 'MMM d, yyyy')}
                            </SelectItem>
                        )
                    })}
                </SelectContent>
            </Select>
            <Button onClick={() => onDateChange(addWeeks(currentDate, 1))}>Next Week</Button>
        </div>
    )
}

const TimesheetForm = ({ week, onSave }) => {
    const [entries, setEntries] = useState({})

    const handleInputChange = (date, client, project, hours) => {
        setEntries(prev => ({
            ...prev,
            [date]: {
                ...prev[date],
                [client]: {
                    ...prev[date]?.[client],
                    [project]: hours
                }
            }
        }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        onSave(entries)
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {week.map(date => (
                <Card key={date}>
                    <CardHeader>
                        <CardTitle>{format(date, 'EEEE, MMM d')}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-4 gap-4">
                            <input
                                type="text"
                                placeholder="Client"
                                className="p-2 border rounded"
                                onChange={(e) => handleInputChange(format(date, 'yyyy-MM-dd'), e.target.value, '', '')}
                            />
                            <input
                                type="text"
                                placeholder="Project"
                                className="p-2 border rounded"
                                onChange={(e) => handleInputChange(format(date, 'yyyy-MM-dd'), '', e.target.value, '')}
                            />
                            <input
                                type="number"
                                placeholder="Hours"
                                className="p-2 border rounded"
                                onChange={(e) => handleInputChange(format(date, 'yyyy-MM-dd'), '', '', e.target.value)}
                            />
                            <Button type="button" onClick={() => console.log('Add more fields')}>+</Button>
                        </div>
                    </CardContent>
                </Card>
            ))}
            <Button type="submit" className="w-full">Save Timesheet</Button>
        </form>
    )
}

const SkeletonLoader = () => {
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

export default function Component() {
    const [currentDate, setCurrentDate] = useState(new Date())
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        // Simulate loading delay
        const timer = setTimeout(() => setIsLoading(false), 1000)
        return () => clearTimeout(timer)
    }, [currentDate])

    const weekStart = startOfWeek(currentDate)
    const weekEnd = endOfWeek(currentDate)
    const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd })

    const handleSave = async (data) => {
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
                <TimesheetForm week={weekDays} onSave={handleSave} />
            )}
        </div>
    )
}