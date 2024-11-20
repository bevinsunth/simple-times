'use client';

import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { format } from 'date-fns';
import { type TimeSheetFormEntry } from '@/lib/server/timesheet';
import { parseDateDDMMYYYY } from '@/lib/date-utils';

const styles = StyleSheet.create({
  page: {
    padding: 20,
    fontSize: 10,
  },
  title: {
    fontSize: 14,
    marginBottom: 15,
    textAlign: 'center',
  },
  table: {
    width: '100%',
    borderStyle: 'solid',
    borderWidth: 0.5,
    borderColor: '#bfbfbf',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 0.5,
    borderBottomColor: '#bfbfbf',
    minHeight: 20,
    alignItems: 'center',
  },
  tableHeader: {
    backgroundColor: '#f0f0f0',
    fontWeight: 'bold',
  },
  tableCell: {
    padding: 3,
    borderRightWidth: 0.5,
    borderRightColor: '#bfbfbf',
    fontSize: 8,
  },
  dateCell: {
    width: '12%',
  },
  dayCell: {
    width: '12%',
  },
  clientCell: {
    width: '30%',
  },
  projectCell: {
    width: '30%',
  },
  hoursCell: {
    width: '16%',
  },
});

interface TimesheetPDFProps {
  data: TimeSheetFormEntry[];
  startDate: Date;
  endDate: Date;
}

const TimesheetPDF = ({
  data,
  startDate,
  endDate,
}: TimesheetPDFProps): JSX.Element => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>
          Timesheet Report ({format(startDate, 'MMM dd, yyyy')} -{' '}
          {format(endDate, 'MMM dd, yyyy')})
        </Text>

        <View style={styles.table}>
          {/* Table Header */}
          <View style={[styles.tableRow, styles.tableHeader]}>
            <View style={[styles.tableCell, styles.dateCell]}>
              <Text>Date</Text>
            </View>
            <View style={[styles.tableCell, styles.dayCell]}>
              <Text>Day</Text>
            </View>
            <View style={[styles.tableCell, styles.clientCell]}>
              <Text>Client</Text>
            </View>
            <View style={[styles.tableCell, styles.projectCell]}>
              <Text>Project</Text>
            </View>
            <View style={[styles.tableCell, styles.hoursCell]}>
              <Text>Hours</Text>
            </View>
          </View>
          \{/* Table Body */}
          {data.map((entry, index) => {
            return (
              <View key={index} style={styles.tableRow}>
                <View style={[styles.tableCell, styles.dateCell]}>
                  <Text>{entry.date.toString()}</Text>
                </View>
                <View style={[styles.tableCell, styles.dayCell]}>
                  <Text>
                    {format(parseDateDDMMYYYY(entry.date.toString()), 'EEEE')}
                  </Text>
                </View>
                <View style={[styles.tableCell, styles.clientCell]}>
                  <Text>{entry.client}</Text>
                </View>
                <View style={[styles.tableCell, styles.projectCell]}>
                  <Text>{entry.project}</Text>
                </View>
                <View style={[styles.tableCell, styles.hoursCell]}>
                  <Text>{entry.hours}</Text>
                </View>
              </View>
            );
          })}
        </View>
      </Page>
    </Document>
  );
};

export default TimesheetPDF;
