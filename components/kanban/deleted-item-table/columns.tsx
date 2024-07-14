'use client'

import { DataTableColumnHeader } from '@/components/table/column-header'
import { Checkbox } from '@/components/ui/checkbox'
import { ItemId } from '@/types/kanban/Item'
import { ColumnDef } from '@tanstack/react-table'

// 列は、テーブルがどのように表示されるかの中核を定義する場所です。列は、表示されるデータ、そのデータの書式設定、並べ替え、フィルタリング方法を定義します。
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type DeletedItemColumn = {
  id: ItemId
  taskId: string
  title: string
  memo: string
  hours: number
  cratedAt: string
}

export const columns: ColumnDef<DeletedItemColumn>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'taskId',
    meta: 'ID',
    header: 'ID',
  },
  {
    accessorKey: 'title',
    meta: 'タイトル',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="タイトル" />
    ),
  },
  {
    accessorKey: 'memo',
    meta: 'メモ',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="メモ" />
    ),
    cell: ({ row }) => {
      return (
        <div className="line-clamp-2 overflow-hidden">
          {row.getValue('memo')}
        </div>
      )
    },
  },
  {
    accessorKey: 'hours',
    meta: '実績',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="実績" />
    ),
  },
  {
    accessorKey: 'cratedAt',
    meta: '作成日',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="作成日" />
    ),
  },
]
