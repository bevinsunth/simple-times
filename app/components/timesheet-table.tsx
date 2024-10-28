'use client'

import React from "react";
import { getDatesOfWeek, timestampToDate } from "@/lib/date-utils";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

import { useSheetStore } from "@/app/context/sheetStore";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Card } from "@/components/ui/card";
import { Clock } from "lucide-react";
import { SheetDate } from "@/types";


interface TimesheetTableProps {
  weekStart: Date;
}


const TimesheetTable: React.FC<TimesheetTableProps> = ({ weekStart }) => {


  const activeSheetDates = getDatesOfWeek(weekStart);



  const createFormSchema = (dates: { date: Date }[]) => {
    const baseSchema = z.coerce.number({
      message: "Please enter a valid number"
    }).positive({
      message: "Please enter a positive number"
    }).lte(24, {
      message: "Please enter a smaller number"
    })

    return z.object(
      dates.reduce((schema, date) => {
        schema[date.date.getTime()] = baseSchema;
        return schema;
      }, {} as Record<string, typeof baseSchema>)
    );
  };

  const form = useForm({
    resolver: zodResolver(createFormSchema(activeSheetDates)),
    mode: "all",
    defaultValues: 
  
});
  console.log("form:", form)

  const onSubmit = (data: Record<string, string>) => {
    console.log(data);
  }


  const timesheetProps = {
    title: "Week starting on: " + activeSheetDates[0].day,
    description: "Period between " + activeSheetDates[0].localeDateString + " and " + activeSheetDates[6].localeDateString,
    headers: activeSheetDates.map((week) => ({ title: week.day })),
  }


  return (

    <Card>
      <Alert>
        <Clock className="h-4 w-4" />
        <AlertTitle>{timesheetProps.title}</AlertTitle>
        <AlertDescription>
          {timesheetProps.description}
        </AlertDescription>
      </Alert>
      <Form {...form} >
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Table>
            <TableHeader>
              <TableRow key="row-header">
                {
                  timesheetProps.headers.map((header, index) => (
                    <TableHead key={index}> {header.title} </TableHead>
                  ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow key="row-inputs">
                {
                  activeSheetDates.map((date) => {
                    const dateKey = date.date.getTime().toString();
                    return (
                      <TableCell key={"cell-" + dateKey}>
                        <FormField
                          control={form.control}
                          name={dateKey}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input type="number" {...field} />
                              </FormControl>
                              <FormDescription>
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        >
                        </FormField>
                      </TableCell>
                    );
                  })
                }
              </TableRow>
            </TableBody>
          </Table>
          <Button onClick={form.handleSubmit(onSubmit)}>Submit</Button>
        </form>
      </Form>
    </Card>
  )
}


export default TimesheetTable
