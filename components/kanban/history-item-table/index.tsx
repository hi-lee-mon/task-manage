'use client'

import {
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
import { useToast } from '@/components/ui/use-toast'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { CommandList } from 'cmdk'
import { columns, HistoryItemColumn } from './columns'
import {
  AlertDialogHeader,
  AlertDialogFooter,
} from '@/components/ui/alert-dialog'
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog'
import { set } from 'zod'

interface DataTableProps {
  columns: typeof columns
  data: HistoryItemColumn[]
}

export function HistoryItemTable({ columns, data }: DataTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
  const [rowSelection, setRowSelection] = useState({})
  const [openCombobox, setOpenCombobox] = useState(false)
  const [comboboxValue, setComboboxValue] = useState<string>('title')
  const [isOpenAlertDialog, setIsOpenAlertDialog] = useState(false)
  const { restoreHistoryItems, deleteHistoryItems } = useItemContext()
  const { toast } = useToast()

  const filterTargetOptions = columns.map((column) => ({
    value: column.accessorKey,
    label: column.meta,
  }))

  const selectedComboboxLabel =
    filterTargetOptions.find(
      (filterColumn) => filterColumn.value === comboboxValue,
    )?.label || ''

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

  const selectedRowIds = table
    .getFilteredSelectedRowModel()
    .rows.map((row) => row.original)
    .map((row) => row.id)

  return (
    <div className="rounded-md border">
      <div className="flex items-center py-4 mx-2 gap-2">
        <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={openCombobox}
              className="w-[200px] justify-between"
            >
              {selectedComboboxLabel
                ? selectedComboboxLabel
                : '検索対象が未選択です'}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandInput placeholder="検索対象を選択" />
              <CommandEmpty>検索対象が見つかりません</CommandEmpty>
              <CommandGroup>
                <CommandList>
                  {filterTargetOptions.map((option) => (
                    <CommandItem
                      key={option.value}
                      value={option.value}
                      onSelect={(currentValue) => {
                        setComboboxValue(currentValue)
                        setOpenCombobox(false)
                      }}
                    >
                      <Check
                        className={cn(
                          'mr-2 h-4 w-4',
                          comboboxValue === option.value
                            ? 'opacity-100'
                            : 'opacity-0',
                        )}
                      />
                      {option.label}
                    </CommandItem>
                  ))}
                </CommandList>
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
        <Input
          placeholder={
            selectedComboboxLabel === ''
              ? '検索対象を選択してください'
              : `${selectedComboboxLabel}で絞り込む`
          }
          value={
            (table.getColumn(comboboxValue)?.getFilterValue() as string) ?? ''
          }
          onChange={(event) =>
            table.getColumn(comboboxValue)?.setFilterValue(event.target.value)
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
                onClick={row.getToggleSelectedHandler()} // 行をクリックで選択できるようにする
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
                現在の削除タスクは0件です
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
      <div className="flex justify-end m-4 gap-6">
        <Button
          variant="destructive"
          onClick={() => {
            if (selectedRowIds.length < 1) {
              toast({
                title: '完全に削除するアイテムを選択してください',
              })
              return
            }
            setIsOpenAlertDialog(true)
          }}
        >
          選択したタスクを完全に削除する
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            if (selectedRowIds.length < 1) {
              toast({
                title: '戻すアイテムを選択してください',
              })
              return
            }
            restoreHistoryItems(selectedRowIds)
            setRowSelection({})
            toast({
              title: 'タスクを戻しました',
            })
          }}
        >
          選択したタスクを戻す
        </Button>
      </div>
      <AlertDialogDemo
        isOpen={isOpenAlertDialog}
        setIsOpen={setIsOpenAlertDialog}
        action={() => {
          deleteHistoryItems(selectedRowIds)
          setRowSelection({})
          toast({
            title: '完全に削除しました',
          })
          setIsOpenAlertDialog(false)
        }}
      />
    </div>
  )
}

export const AlertDialogDemo = (props: {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
  action: () => void
}) => {
  return (
    <AlertDialog open={props.isOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>本当に削除して良いですか？</AlertDialogTitle>
          <AlertDialogDescription>
            この操作は取り消すことができません。
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex gap-6">
          <AlertDialogAction onClick={props.action}>
            完全に削除する
          </AlertDialogAction>
          <AlertDialogCancel onClick={() => props.setIsOpen(false)}>
            キャンセル
          </AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
