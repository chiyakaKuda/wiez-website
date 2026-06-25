"use client";

import { flexRender, getCoreRowModel, useReactTable, type ColumnDef } from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function DataTable<TData>({
  columns,
  data,
  emptyMessage = "No results found.",
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- heterogeneous per-column value types don't unify under a single TValue
  columns: ColumnDef<TData, any>[];
  data: TData[];
  emptyMessage?: string;
}) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <Table>
      <TableHeader className="bg-slate-50">
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow key={headerGroup.id} className="hover:bg-slate-50">
            {headerGroup.headers.map((header) => (
              <TableHead
                key={header.id}
                className="font-nav text-xs font-medium tracking-wide text-slate-500 uppercase"
              >
                {header.isPlaceholder
                  ? null
                  : flexRender(header.column.columnDef.header, header.getContext())}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
        {table.getRowModel().rows.length ? (
          table.getRowModel().rows.map((row) => (
            <TableRow key={row.id} className="border-b border-slate-100 hover:bg-slate-50">
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id} className="font-sans text-sm text-slate-700">
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell
              colSpan={columns.length}
              className="py-10 text-center font-sans text-sm text-slate-400"
            >
              {emptyMessage}
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
