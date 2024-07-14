'use client'

import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'

import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { DataTablePagination } from '@/components/table/data-table-pagination'
import { useState } from 'react'
import { Input } from '@/components/ui/input'
import React from 'react'
import { DataTableViewOptions } from '@/components/table/data-table-viewOptions'
import { Button } from '@/components/ui/button'
import { useItemContext } from '@/context/item-context'
import { toast, useToast } from '@/components/ui/use-toast'

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export function DeletedItemTable<
  TData extends { id: string | number },
  TValue,
>({ columns, data }: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [rowSelection, setRowSelection] = useState({})
  const { restoreItems } = useItemContext()
  const { toast } = useToast()

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(), // ページネーション
    onSortingChange: setSorting, // ソート
    getSortedRowModel: getSortedRowModel(), // ソート
    onColumnFiltersChange: setColumnFilters, // 検索機能
    getFilteredRowModel: getFilteredRowModel(), // 検索機能
    onRowSelectionChange: setRowSelection, // 選択機能
    state: {
      sorting,
      columnFilters,
      rowSelection,
    },
  })

  const originalRowIds = table
    .getFilteredSelectedRowModel()
    .rows.map((row) => row.original)
    .map((row) => row.id)

  return (
    <div className="rounded-md border">
      <div className="flex items-center py-4 mx-2">
        <Input
          placeholder="タイトルで絞り込む..."
          value={(table.getColumn('title')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('title')?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DataTableViewOptions table={table} />
      </div>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead
                    key={header.id}
                    style={{ width: header.getSize() }} // テーブル幅の設定
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && 'selected'}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell
                    key={cell.id}
                    style={{ width: cell.column.getSize() }} // テーブル幅の設定
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell colSpan={columns.length}>
              <DataTablePagination table={table} />
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
      <div className="flex justify-end m-4">
        <Button
          variant="outline"
          onClick={() => {
            if (originalRowIds.length < 1) {
              toast({
                title: '復元するアイテムを選択してください',
                variant: 'destructive',
              })
              return
            }
            restoreItems(originalRowIds)
            setRowSelection({})
          }}
        >
          選択したタスクを復元
        </Button>
      </div>
    </div>
  )
}
