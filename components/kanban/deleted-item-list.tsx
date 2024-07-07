import { useItemContext } from '@/context/item-context'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import { MoreHorizontal } from 'lucide-react'
import { Button } from '../ui/button'

export default function DeletedItemList() {
  const { deletedItems, restoreItem } = useItemContext()
  return (
    <Card>
      <CardHeader className="px-7">
        <CardTitle>削除アイテム</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>タイトル</TableHead>
              <TableHead>メモ</TableHead>
              <TableHead>実績</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {deletedItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{`${item.categoryNumber}-${item.groupNumber}`}</TableCell>
                <TableCell>{item.title}</TableCell>
                <TableCell>{item.memo}</TableCell>
                <TableCell>{item.hours}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button aria-haspopup="true" size="icon" variant="ghost">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Toggle menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>操作</DropdownMenuLabel>
                      <hr />
                      <DropdownMenuItem onClick={() => restoreItem(item.id)}>
                        復元
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => {}}>
                        完全に削除
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
