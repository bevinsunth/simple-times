'use client'
import TimesheetTable from "@/app/components/timesheet-table";

const today = new Date()

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-20 py-2">
      <TimesheetTable weekStart={today} />
    </div>

  );
}
