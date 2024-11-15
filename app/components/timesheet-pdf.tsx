'use client';

import { TimeSheetFormEntry } from '@/lib/server/timesheet';
import { Item } from '@radix-ui/react-select';
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer';
import { format } from 'date-fns';

interface PDFReportProps {
  data: TimeSheetFormEntry[];
  startDate: Date;
  endDate: Date;
}

// PDF styles
const styles = StyleSheet.create({
  page: { padding: 30, fontFamily: 'Helvetica' },
  title: {
    fontSize: 24,
    marginBottom: 20,
    color: '#333333',
    fontWeight: 'bold',
  },
  subtitle: { fontSize: 14, marginBottom: 20, color: '#666666' },
  table: {
    display: 'flex',
    width: 'auto',
    borderStyle: 'solid',
    borderColor: '#CCCCCC',
    borderWidth: 1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableRow: { margin: 'auto', flexDirection: 'row' },
  tableColHeader: {
    width: '50%',
    borderStyle: 'solid',
    borderColor: '#CCCCCC',
    borderBottomColor: '#000000',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableCol: {
    width: '50%',
    borderStyle: 'solid',
    borderColor: '#CCCCCC',
    borderWidth: 1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
  },
  tableCellHeader: {
    margin: 'auto',
    marginTop: 5,
    marginBottom: 5,
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000000',
  },
  tableCell: {
    margin: 'auto',
    marginTop: 5,
    marginBottom: 5,
    fontSize: 10,
    color: '#333333',
  },
  totals: { marginTop: 30, fontSize: 14, fontWeight: 'bold', color: '#000000' },
});

// PDF Document component
const TimesheetPDF = ({ data, startDate, endDate }: PDFReportProps) => {
  const totalHours = data.reduce((sum, item) => sum + item.hours, 0);

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Timesheet Report</Text>
        <Text style={styles.subtitle}>
          From: {format(startDate, 'MMMM d, yyyy')} To:{' '}
          {format(endDate, 'MMMM d, yyyy')}
        </Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>{Item.client}</Text>
            </View>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>Hours</Text>
            </View>
          </View>
          {data.map((item, index) => (
            <View key={index} style={styles.tableRow}>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{item.project}</Text>
              </View>
              <View style={styles.tableCol}>
                <Text style={styles.tableCell}>{item.hours}</Text>
              </View>
            </View>
          ))}
        </View>
        <Text style={styles.totals}>Total Hours: {totalHours}</Text>
      </Page>
    </Document>
  );
};

export default TimesheetPDF;
