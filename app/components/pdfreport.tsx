"use client"

import * as React from "react"
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { TimeEntryDocument } from "@/lib/types/document-data.types";
import { dateToDayString, dateToLocaleString } from "@/lib/date-utils";

interface PDFReportProps {
  timesheetData: TimeEntryDocument[];
}

const styles = StyleSheet.create({
  page: { fontSize: 11, paddingTop: 20, paddingLeft: 40, paddingRight: 40, lineHeight: 1.5, flexDirection: 'column' },
  spaceBetween: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', color: "#3E3E3E" },
  titleContainer: { flexDirection: 'row', marginTop: 24 },
  reportTitle: { fontSize: 16, textAlign: 'center' },
  table: { width: "auto", borderStyle: "solid", borderWidth: 1, borderRightWidth: 0, borderBottomWidth: 0 },
  tableRow: { flexDirection: "row" },
  tableCell: { margin: "auto", marginTop: 5, fontSize: 10 },
  theader: { marginTop: 20, fontSize: 10, fontWeight: 'bold', paddingTop: 4, paddingLeft: 7, flex: 1, height: 20, backgroundColor: '#DEDEDE', borderColor: 'whitesmoke', borderRightWidth: 1, borderBottomWidth: 1 },
  theader2: { flex: 2, borderRightWidth: 0, borderBottomWidth: 1 },
  tbody: { fontSize: 9, paddingTop: 4, paddingLeft: 7, flex: 1, borderColor: 'whitesmoke', borderRightWidth: 1, borderBottomWidth: 1 },
  tbody2: { flex: 2, borderRightWidth: 1 },
});

const PDFReport: React.FC<PDFReportProps> = ({ timesheetData }) => {
  return (
    <Document>
      <Page style={styles.page}>
        <View style={styles.titleContainer}>
          <Text style={styles.reportTitle}>Timesheet Report</Text>
        </View>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={styles.theader2}>
              <Text style={styles.tableCell}>Date</Text>
            </View>
            <View style={styles.theader2}>
              <Text style={styles.tableCell}>Day</Text>
            </View>
            <View style={styles.theader2}>
              <Text style={styles.tableCell}>Project</Text>
            </View>
            <View style={styles.theader2}>
              <Text style={styles.tableCell}>Hours</Text>
            </View>
          </View>
          {timesheetData.map((entry, index) => (
            <View style={styles.tableRow} key={index}>
              <View style={styles.tbody}>
                <Text style={styles.tableCell}>{dateToLocaleString(entry.dateTime)}</Text>
              </View>
              <View style={styles.tbody}>
                <Text style={styles.tableCell}>{dateToDayString(entry.dateTime)}</Text>
              </View>
              <View style={styles.tbody}>
                <Text style={styles.tableCell}>NHP</Text>
              </View>
              <View style={styles.tbody}>
                <Text style={styles.tableCell}>{entry.hours}</Text>
              </View>
            </View>
          ))}
        </View>
      </Page>
    </Document>
  )
}

export default PDFReport;