"use client"

import * as React from "react"
import { TimeEntryDocument } from "@/lib/types/document-data.types";
import { dateToDayString, dateToLocaleString } from "@/lib/date-utils";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"


interface PDFReportProps {
  timesheetData: TimeEntryDocument[];
}

const PDFReport: React.FC<PDFReportProps> = ({ timesheetData }) => {
  const fromDate = timesheetData[0].dateTime;
  const toDate = timesheetData[timesheetData.length - 1].dateTime;
  return (
    <>
      <div className="p-40">
        <div className="flex-row text-2xl p-10">Timesheet for period between {dateToLocaleString(fromDate)} and {dateToLocaleString(toDate)}</div>
        <Table className="flex-row justify-evenly">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Date</TableHead>
              <TableHead className="w-[100px]">Day</TableHead>
              <TableHead className="w-[200px]">Project</TableHead>
              <TableHead className="w-[100px]">Hours</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {timesheetData.map((data) => (
              <TableRow key={data.id}>
                <TableCell className="font-medium">{dateToLocaleString(data.dateTime)}</TableCell>
                <TableCell>{dateToDayString(data.dateTime)}</TableCell>
                <TableCell>{"NHP - Web Development"}</TableCell>
                <TableCell>{data.hours}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </>
  )
}

export default PDFReport;