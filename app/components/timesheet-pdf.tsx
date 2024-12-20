'use client';

import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { format } from 'date-fns';
import { type TimeEntryData } from '@/lib/types';
import { parseDateDDMMYYYY } from '@/lib/utils/date';

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

interface TimeEntryDataWithClientAndProject extends TimeEntryData {
  clientName: string;
  projectName: string;
}

interface TimesheetPDFProps {
  data: TimeEntryDataWithClientAndProject[];
  startDate: Date;
  endDate: Date;
}

const TimesheetPDF = ({
  data,
  startDate,
  endDate,
}: TimesheetPDFProps): JSX.Element => {
  const sortedData = data.sort((a, b) => {
    return a.date.getTime() - b.date.getTime();
  });
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
          {sortedData.map((entry, index) => {
            return (
              <View key={index} style={styles.tableRow}>
                <View style={[styles.tableCell, styles.dateCell]}>
                  <Text>{format(new Date(entry.date), 'dd/MM/yyyy')}</Text>
                </View>
                <View style={[styles.tableCell, styles.dayCell]}>
                  <Text>{format(new Date(entry.date), 'EEEE')}</Text>
                </View>
                <View style={[styles.tableCell, styles.clientCell]}>
                  <Text>{entry.clientName}</Text>
                </View>
                <View style={[styles.tableCell, styles.projectCell]}>
                  <Text>{entry.projectName}</Text>
                </View>
                <View style={[styles.tableCell, styles.hoursCell]}>
                  <Text>{entry.hours.toString()}</Text>
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
