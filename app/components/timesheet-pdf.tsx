'use client';

import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { format } from 'date-fns';
import { type TimeSheetFormEntry } from '@/lib/server/timesheet';

const styles = StyleSheet.create({
  page: {
    padding: 30,
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
    textAlign: 'center',
  },
  table: {
    display: 'table',
    width: '100%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#bfbfbf',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#bfbfbf',
    minHeight: 30,
    alignItems: 'center',
  },
  tableHeader: {
    backgroundColor: '#f0f0f0',
    fontWeight: 'bold',
  },
  tableCell: {
    padding: 5,
    borderRightWidth: 1,
    borderRightColor: '#bfbfbf',
  },
  dateCell: {
    width: '15%',
  },
  dayCell: {
    width: '15%',
  },
  clientCell: {
    width: '25%',
  },
  projectCell: {
    width: '25%',
  },
  hoursCell: {
    width: '20%',
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

          {/* Table Body */}
          {data.map((entry, index) => (
            <View key={index} style={styles.tableRow}>
              <View style={[styles.tableCell, styles.dateCell]}>
                <Text>{format(entry.date, 'MM/dd/yyyy')}</Text>
              </View>
              <View style={[styles.tableCell, styles.dayCell]}>
                <Text>{format(entry.date, 'EEEE')}</Text>
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
          ))}
        </View>
      </Page>
    </Document>
  );
};

export default TimesheetPDF;
