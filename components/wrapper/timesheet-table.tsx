"use client"

import React from "react";
import type { Week, TableProps } from "@/types/index";
import { DaysOfWeek } from "@/types/constants";
import { getDatesOfCurrentWeek } from "@/utils/dateUtils";

import { Input } from "../ui/input";
import { Button } from "@/components/ui/button"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { date, map, z } from "zod"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"


import DummyTable from "../dummy/table";

const currentWeek: Week[] = getDatesOfCurrentWeek();
let tableProps: TableProps = {
  title: "",
  columns: currentWeek.map((week) => ({ title: week.day })),
  rows: currentWeek.map((week) => [<Input key={week.date.getTime()} />]),
};



const TimesheetTable = () => {


  // Define the base schema for common validation rules
  const baseSchema = z.number().min(2, {
    message: "Value must be at least 2.",
  }).max(24, {
    message: "Value must be at most 24.",
  });
  const formSchema = z.object(
    DaysOfWeek.reduce((schema, day) => {
      schema[day] = baseSchema;
      return schema;
    }, {} as Record<typeof DaysOfWeek[number], typeof baseSchema>)
  );

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: DaysOfWeek.reduce((values, day) => {
      values[day] = 0;
      return values;
    }, {} as Record<typeof DaysOfWeek[number], number>)
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    console.log(values)
  }

  tableProps.rows = currentWeek.map((week) => [

    <FormField
      control={form.control}
      name={week.day}
      key={week.date.getTime()}
      render={({ field }) => (
        <FormItem>
          <FormLabel></FormLabel>
          <FormControl>
            <Input type="number"  {...field}
              onChange={(e) => field.onChange(Number(e.target.value))} />
          </FormControl>
          <FormDescription>
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    >
    </FormField>

  ]);

  return (

    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <DummyTable {...tableProps} />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
};

export default TimesheetTable;
