"use client"

import React, { useEffect, useState, useCallback } from "react"

import { TimesheetTable, TimesheetTableProps } from "@/app/components/timesheet-table"
import { getDatesOfWeek } from "@/lib/date-utils"
import { populateTimeEntryData } from "@/lib/server/timesheet"
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"

//todo: get active monday
const today = new Date()
let sheetDates = getDatesOfWeek(today)

const Sheet = () => {

  const [activeDay, setActiveDay] = useState(today)
  const [datesOfTheWeek, setDatesOfTheWeek] = useState<Date[]>(sheetDates)
  const [timesheetTableProps, setTimesheetTableProps] = useState<TimesheetTableProps>()

  useEffect(() => {
    setDatesOfTheWeek(getDatesOfWeek(activeDay))
  }, [activeDay])


  const fetchTimeEntryData = useCallback(async (dates: Date[]) => {
    const data = await populateTimeEntryData(dates)
    return { timeEntryData: data, activeDates: dates }
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      if (!activeDay) return;
      const data = await fetchTimeEntryData(datesOfTheWeek);
      setTimesheetTableProps(data);
    };
    fetchData();
  }, [datesOfTheWeek]);

  const onClickPrevious = () => {
    setActiveDay(new Date(activeDay.setDate(activeDay.getDate() - 7)))
  }

  const onClickNext = () => {
    setActiveDay(new Date(activeDay.setDate(activeDay.getDate() + 7)))
  }

  return (
    <div className="flex flex-col min-h-lvh p-10">
      <div className="flex-3"></div>
      <div className="flex justify-center items-center flex-1">
        {timesheetTableProps && <TimesheetTable {...timesheetTableProps} />}
      </div>
      <div className="flex-1 items-start">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious onClick={onClickPrevious} />
            </PaginationItem>
            <PaginationItem>
              <PaginationNext onClick={onClickNext} />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  )
}

export default Sheet