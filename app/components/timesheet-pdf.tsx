'use client'

import { useState } from 'react'
import { Document, Page, Text, View, StyleSheet, PDFDownloadLink } from '@react-pdf/renderer'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { format } from "date-fns"
import { TimeEntryData } from '@/lib/types/document-data.types'

interface PDFReportProps {
  data: TimeEntryData[],
  startDate: Date,
  endDate: Date,
}

// PDF styles
const styles = StyleSheet.create({
  page: { padding: 30 },
  title: { fontSize: 24, marginBottom: 20 },
  table: { display: 'flex', width: 'auto', borderStyle: 'solid', borderWidth: 1, borderRightWidth: 0, borderBottomWidth: 0 },
  tableRow: { margin: 'auto', flexDirection: 'row' },
  tableCol: { width: '50%', borderStyle: 'solid', borderWidth: 1, borderLeftWidth: 0, borderTopWidth: 0 },
  tableCell: { margin: 'auto', marginTop: 5, fontSize: 10 }
})

// PDF Document component
export const TimesheetPDF = ({ data, startDate, endDate }: PDFReportProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <Text style={styles.title}>Timesheet Report</Text>
      <Text>From: {startDate.toDateString()} To: {endDate.toDateString()}</Text>
      <View style={styles.table}>
        <View style={styles.tableRow}>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>Client</Text>
          </View>
          <View style={styles.tableCol}>
            <Text style={styles.tableCell}>Hours</Text>
          </View>
        </View>
        {data.map((item, index) => (
          <View style={styles.tableRow} key={index}>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{"NHP"}</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>{item.hours}</Text>
            </View>
          </View>
        ))}
      </View>
    </Page>
  </Document>
)