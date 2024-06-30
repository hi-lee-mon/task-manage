import clsx from 'clsx'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { ItemType } from '@/types/kanban/Item'
import { Pen } from 'lucide-react'
import { useState } from 'react'
import Link from 'next/link'
import { Button } from '../ui/button'
import ItemFormDialog from './item-form-dialog'
import { ItemFormSchemaType } from './itemFormSchema'
import { UniqueIdentifier } from '@dnd-kit/core'

type ItemProps = {
  item: ItemType
  editItem: (form: ItemFormSchemaType, itemId: UniqueIdentifier) => void
}

export default function Item(props: ItemProps) {
  const { item, editItem } = props
  const [isEditing, setIsEditing] = useState(false)
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: item.id,
    data: {
      type: 'item',
      item,
    },
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={clsx(
        'h-32 rounded-md shadow-sm bg-card p-4 border overflow-y-auto hover:border-blue-500 transition duration-150',
        isDragging && 'opacity-50 border-blue-500',
      )}
    >
      <div className="flex flex-col">
        <div className="flex justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm">{`[${item.categoryNumber}-${item.groupNumber}] `}</span>
            <h1 className="text-xl">{item.title}</h1>
            <span className="text-sm text-muted-foreground">{item.hours}h</span>
          </div>
          <ItemFormDialog
            dialogTitle="アイテム編集"
            triggerContent={
              <Button variant="ghost" size="icon">
                <Pen className="absolute h-[1.2rem] w-[1.2rem] " />
                <span className="sr-only">編集</span>
              </Button>
            }
            handleSubmit={editItem}
            targetId={item.id}
            defaultValues={item}
            submitText="更新"
          />
        </div>
        <p
          onClick={() => setIsEditing((prev) => !prev)}
          className={clsx(
            'text-sm line-clamp-3',
            isEditing && 'line-clamp-none',
          )}
        >
          {item.memo}
        </p>
        {item.links.map((link, index) => (
          <Link
            key={index}
            className="text-sm text-blue-500 underline-offset-4 hover:underline"
            href={link.url}
          >
            ・{link.title}
          </Link>
        ))}
      </div>
    </div>
  )
}
