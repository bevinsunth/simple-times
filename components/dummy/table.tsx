"use client"

import React from "react";
import type { TableProps } from "@/types/index";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";



const DummyTable = (tableProps : TableProps) => {
  return (
    <Table>
      <TableCaption>{ tableProps.title }</TableCaption>
      <TableHeader>
        <TableRow>
            {
            tableProps.columns.map((column, index) => (
                <TableHead key={index}> {column.title} </TableHead>
            ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow>
            {tableProps.rows.map((rownode, index) => (
                <TableCell key={index}>
                    {rownode}
                </TableCell>
            ))}
        </TableRow>
      </TableBody>
    </Table>
  );
};

export default DummyTable;