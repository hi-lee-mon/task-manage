import { ItemId, ItemType } from '@/types/kanban/Item'
import { ContainerId, ContainerType } from '@/types/kanban/container'
import { useSortable, SortableContext } from '@dnd-kit/sortable'
import clsx from 'clsx'
import { CSS } from '@dnd-kit/utilities'
import { useMemo } from 'react'
import Item from './item'
import { ItemFormSchemaType } from './itemFormSchema'
import ItemFormDialog from './item-form-dialog'
import { Button } from '../ui/button'

interface ContainerProps {
  container: ContainerType
  items: ItemType[]
  addItem: (form: ItemFormSchemaType, containerId: ContainerId) => void
  editItem: (form: ItemFormSchemaType, itemId: ItemId) => void
}
export default function Container(props: ContainerProps) {
  const { container, items, addItem, editItem } = props

  const itemIds = useMemo(() => {
    return items.map((i) => i.id)
  }, [items])

  const {
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
    setNodeRef,
  } = useSortable({
    id: container.id,
    data: {
      type: 'container',
      container,
    },
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  // TODO: containerの高さを自動的に計算する

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={clsx(
        'shadow-sm bg-card border rounded-md p-4 flex flex-col gap-y-4',
        isDragging && 'opacity-50',
      )}
    >
      <ItemFormDialog
        dialogTitle="アイテム追加"
        triggerContent={<Button variant="default">アイテム追加</Button>}
        handleSubmit={addItem}
        targetId={container.id}
        submitText="追加"
        isContinuousCreation
      />
      <h1 className="text-xl border-b pb-2 mb-6">
        {container.title}
        <span className="ml-2">
          {items.reduce((acc, item) => acc + item.hours, 0)}h
        </span>
      </h1>
      <div className="flex flex-col gap-4 overflow-y-auto overflow-x-hidden">
        <SortableContext items={itemIds}>
          {items.map((i) => (
            <Item key={i.id} item={i} editItem={editItem} />
          ))}
        </SortableContext>
      </div>
    </div>
  )
}
