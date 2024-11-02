import React from "react"

import { TimesheetTable } from "@/app/components/timesheet-table"

const today = new Date()

const Sheet = () => {
  return (
    <div className="flex min-h-20 flex-col items-center justify-center py-2">
      <TimesheetTable weekStart={today} />
    </div>
  )
}

export default Sheet
