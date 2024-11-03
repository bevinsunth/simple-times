"use client"

import React, { useEffect, useState, useCallback } from "react"

import { TimesheetTable, TimesheetTableProps } from "@/app/components/timesheet-table"
import { getDatesOfWeek } from "@/lib/date-utils"
import { populateTimeEntryData } from "@/lib/server/timesheet"

const today = new Date()

const Sheet = () => {

  const [timesheetTableProps, setTimesheetTableProps] = useState<TimesheetTableProps>()

  const fetchTimeEntryData = useCallback(async (date: Date) => {
    const datesOfTheWeek = getDatesOfWeek(date)
    const data = await populateTimeEntryData(datesOfTheWeek)
    return { timeEntryData: data, activeDates: datesOfTheWeek }
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      if (!today) return;
      const data = await fetchTimeEntryData(today);
      setTimesheetTableProps(data);
    };
    fetchData();
  }, [fetchTimeEntryData]);

  return (
    <div className="flex min-h-20 flex-col items-center justify-center py-2">
      {timesheetTableProps && <TimesheetTable {...timesheetTableProps} />}
    </div>
  )
}

export default Sheet