"use client"

import React, { useEffect, useState, useCallback } from "react"

import { TimesheetTable, TimesheetTableProps } from "@/app/components/timesheet-table"
import { getDatesOfWeek } from "@/lib/date-utils"
import { populateTimeEntryData } from "@/lib/server/timesheet"

const today = new Date()
const datesOfTheWeek = getDatesOfWeek(today)

const Sheet = () => {

  const [timesheetTableProps, setTimesheetTableProps] = useState<TimesheetTableProps>()

  const fetchTimeEntryData = useCallback(async (date: Date) => {
    const data = await populateTimeEntryData(datesOfTheWeek)
    return { timeEntryData: data, activeDates: datesOfTheWeek }
  }, [datesOfTheWeek])

  useEffect(() => {
    const fetchData = async () => {
      if (!today) return;
      const data = await fetchTimeEntryData(today);
      setTimesheetTableProps(data);
    };
    fetchData();
  }, [datesOfTheWeek]);

  return (
    <div className="flex flex-col min-h-lvh p-10">
      <div className="flex-3"></div>
      <div className="flex justify-center items-center flex-1">
        {timesheetTableProps && <TimesheetTable {...timesheetTableProps} />}
      </div>
      <div className="flex-1"></div>
    </div>
  )
}

export default Sheet