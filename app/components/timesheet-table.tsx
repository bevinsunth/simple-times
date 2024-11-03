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
import { dateToDayString, dateToLocaleString } from "@/lib/date-utils"
import { format } from "date-fns"
import { addOrUpdateWeeklyTimeSheet, populateTimeEntryData } from "@/lib/server/timesheet"
import type { TimeEntryData } from "@/lib/types/document-data.types"

export interface TimesheetTableProps {
  activeDates: Date[],
  timeEntryData: TimeEntryData[]
}

const TimesheetTable: React.FC<TimesheetTableProps> = (props: TimesheetTableProps) => {




  //extract 

  const createFormSchema = (dates: TimeEntryData[]) => {
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
      dates.reduce<Record<string, typeof baseSchema>>((schema, timeEntryData) => {
        schema[timeEntryData.date] = baseSchema
        return schema
      }, {})
    )
  }

  const form = useForm({
    resolver: zodResolver(createFormSchema(props.timeEntryData)),
    mode: "all",
    defaultValues: props.timeEntryData.reduce<Record<string, string>>(
      (values: Record<string, string>, timeEntry) => {
        values[timeEntry.date] = timeEntry.hours === 0 ? "" : timeEntry.hours.toString()
        return values;
      },
      {}
    ),
  });

  const onSubmit = async (data: Record<string, string>) => {
    const result = Object.entries(data).reduce<TimeEntryData[]>(
      (acc, [key, value]: [string, string]) => {
        const hours = parseFloat(value)
        if (!Number.isNaN(hours) && hours > 0) {
          acc.push({
            date: key,
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
    props.activeDates.length > 0
      ? {
        title: `Week starting on: ${props.activeDates[0] ? dateToDayString(props.activeDates[0]) ?? "N/A" : "N/A"}`,
        description: `Period between ${props.activeDates[0] ? dateToLocaleString(props.activeDates[0]) : "N/A"} and ${props.activeDates[6] ? dateToLocaleString(props.activeDates[6]) : "N/A"}`,
        headers: props.activeDates.map((week: Date) => ({ title: dateToDayString(week) })),
      }
      : {
        title: "Week starting on: N/A",
        description: "Period between N/A and N/A",
        headers: [],
      }

  return (
    <Card className="container mx-auto px-4">
      <div>
        <div className="flex-1">
          <Clock className="size-5" />
        </div>
        <div className="flex-1">
          <AlertTitle>{timesheetProps.title}</AlertTitle>
          <AlertDescription>{timesheetProps.description}</AlertDescription>
        </div>
      </div>
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
                {props.timeEntryData.map((data) => {
                  return (
                    <TableCell key={`cell-${data.date}`}>
                      <FormField
                        control={form.control}
                        name={data.date}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input type="number" {...field} className="w-20" />
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
          <div className="flex justify-center p-5">
            <Button size={"lg"} className="bg-primary" onClick={form.handleSubmit(onSubmit)}>Submit</Button>
          </div>
        </form>
      </Form>
    </Card>
  )
}


export { TimesheetTable }
