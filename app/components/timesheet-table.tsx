"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Clock } from "lucide-react"
import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { date, z } from "zod"

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
import { dateToDayString, dateToLocaleString, getDateValue, parseDateDDMMYYYY } from "@/lib/date-utils"
import { addOrUpdateWeeklyTimeSheet } from "@/lib/server/timesheet"
import type { TimeEntryData } from "@/lib/types/document-data.types"

export interface TimesheetTableProps {
  activeDates: Date[],
  timeEntryData: TimeEntryData[]
}

const TimesheetTable: React.FC<TimesheetTableProps> = (props: TimesheetTableProps) => {


  const createFormSchema = (dates: TimeEntryData[]) => {
    const baseSchema = z.union([
      z.coerce
        .number({
          message: "Please enter a valid number",
        })
        .positive({
          message: "Please enter a positive number",
        })
        .lte(24, {
          message: "Please enter a number smaller than 24",
        })
        .optional(),
      z.string().refine((val) => val === "", {
        message: "Please enter a valid number or leave it empty",
      })
    ])

    return z.object(
      dates.reduce<Record<string, typeof baseSchema>>((schema, timeEntryData) => {
        schema[timeEntryData.dateString] = baseSchema
        return schema
      }, {})
    )
  }

  const form = useForm({
    resolver: zodResolver(createFormSchema(props.timeEntryData)),
    mode: "all",
    defaultValues: props.timeEntryData.reduce<Record<string, string>>(
      (values: Record<string, string>, timeEntry) => {
        values[timeEntry.dateString] = timeEntry.hours === 0 ? "" : timeEntry.hours.toString()
        return values;
      },
      {}
    ),
  });

  console.log(form)

  const onSubmit = async (data: Record<string, string>) => {
    const result = Object.entries(data).reduce<TimeEntryData[]>(
      (acc, [key, value]: [string, string]) => {
        const hours = parseFloat(value)
        if (!Number.isNaN(hours) && hours > 0) {
          acc.push({
            dateString: key,
            dateTime: parseDateDDMMYYYY(key),
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
      }
      : {
        title: "Week starting on: N/A",
        description: "Period between N/A and N/A",
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
                {props.timeEntryData.map((data, key) => {
                  return (
                    <TableHead key={key}> {dateToLocaleString(data.dateTime)} </TableHead>
                  )
                })}
              </TableRow>
              <TableRow key="row-header">
                {props.timeEntryData.map((data, key) => {
                  return (
                    <TableHead key={key}> {dateToDayString(data.dateTime)} </TableHead>
                  )
                })}
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow key="row-inputs">
                {props.timeEntryData.map((data) => {
                  return (
                    <TableCell key={`cell-${data.dateString}`}>
                      <FormField
                        control={form.control}
                        name={data.dateString}
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
