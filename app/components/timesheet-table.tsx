"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Clock } from "lucide-react"
import React, { useEffect } from "react"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { getDatesOfWeek, timestampStringToDate } from "@/lib/date-utils"
import { addOrUpdateWeeklyTimeSheet, getTimeEntryData } from "@/lib/server/timesheet"
import type { SheetDate, TimeEntryData } from "@/lib/types/document-data.types"

interface TimesheetTableProps {
  weekStart: Date
}

const TimesheetTable: React.FC<TimesheetTableProps> = ({ weekStart }) => {

  const [activeSheetDates, setactiveSheetDates] = React.useState<SheetDate[]>([])
  const [timeEntryData, setTimeEntryData] = React.useState<TimeEntryData[]>([])

  const fetchTimeEntryData = React.useCallback(async () => {
    const dates = getDatesOfWeek(weekStart)
    console.log("dates", dates)
    setactiveSheetDates(dates)
    const data = await getTimeEntryData(activeSheetDates)
    console.log("data", data)
    setTimeEntryData(data)
  }, [weekStart])

  useEffect(() => {
    fetchTimeEntryData();
  }, [weekStart]);


  //extract 

  const createFormSchema = (dates: { date: Date }[]) => {
    const baseSchema = z.union([
      z.string().refine((val) => val === "", {
        message: "Please enter a valid number or leave it empty",
      }),
      z.coerce
        .number({
          message: "Please enter a valid number",
        })
        .positive({
          message: "Please enter a positive number",
        })
        .lte(24, {
          message: "Please enter a smaller number",
        }),
    ])

    return z.object(
      dates.reduce<Record<string, typeof baseSchema>>((schema, date) => {
        schema[date.date.getTime()] = baseSchema
        return schema
      }, {})
    )
  }

  const form = useForm({
    resolver: zodResolver(createFormSchema(activeSheetDates)),
    mode: "all",
    // ToDo: Assign values from server
    values: activeSheetDates.reduce<Record<string, string>>(
      (values, sheetDate) => {
        values[sheetDate.date.getTime()] =
          //find the date in timeEntryData and assign the hours
          timeEntryData.find((entry) => entry.date.getTime() === sheetDate.date.getTime())?.hours.toString() ?? ""; // Ensure default value is set
        return values
      },
      {}
    ),
  })

  const onSubmit = async (data: Record<string, string>) => {
    const result = Object.entries(data).reduce<TimeEntryData[]>(
      (acc, [key, value]: [string, string]) => {
        const hours = parseFloat(value)
        if (!Number.isNaN(hours) && hours > 0) {
          acc.push({
            date: timestampStringToDate(key),
            hours,
          })
        }
        return acc
      },
      []
    )
    await addOrUpdateWeeklyTimeSheet(result)
  }

  const timesheetProps =
    activeSheetDates.length > 0
      ? {
        title: `Week starting on: ${activeSheetDates[0]?.day ?? "N/A"}`,
        description: `Period between ${activeSheetDates[0]?.localeDateString ?? "N/A"} and ${activeSheetDates[6]?.localeDateString ?? "N/A"}`,
        headers: activeSheetDates.map((week) => ({ title: week.day })),
      }
      : {
        title: "Week starting on: N/A",
        description: "Period between N/A and N/A",
        headers: [],
      }

  return (
    <Card>
      <Alert>
        <Clock className="size-4" />
        <AlertTitle>{timesheetProps.title}</AlertTitle>
        <AlertDescription>{timesheetProps.description}</AlertDescription>
      </Alert>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Table>
            <TableHeader>
              <TableRow key="row-header">
                {timesheetProps.headers.map((header, index) => (
                  <TableHead key={index}> {header.title} </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow key="row-inputs">
                {activeSheetDates.map((date) => {
                  const dateKey = date.date.getTime().toString()
                  return (
                    <TableCell key={`cell-${dateKey}`}>
                      <FormField
                        control={form.control}
                        name={dateKey}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input type="number" {...field} />
                            </FormControl>
                            <FormDescription />
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </TableCell>
                  )
                })}
              </TableRow>
            </TableBody>
          </Table>
          <Button onClick={form.handleSubmit(onSubmit)}>Submit</Button>
        </form>
      </Form>
    </Card>
  )
}

export { TimesheetTable }
