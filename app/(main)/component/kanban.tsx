'use client'
import Container from '@/components/kanban/container'
import { HistoryItemTable } from '@/components/kanban/history-item-table'
import {
  HistoryItemColumn,
  columns,
} from '@/components/kanban/history-item-table/columns'
import Item from '@/components/kanban/item'
import { useItemContext } from '@/context/item-context'
import { usePassCodeContext } from '@/context/pass-code-context'
import { ItemType } from '@/types/kanban/Item'
import { ContainerType } from '@/types/kanban/container'
import {
  DndContext,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { SortableContext, arrayMove } from '@dnd-kit/sortable'
import { useRouter } from 'next/navigation'
import { useMemo, useState } from 'react'

export default function Kanban() {
  const router = useRouter()
  const { passCode } = usePassCodeContext()
  if (passCode === null) {
    router.push('/')
  }

  const [containers, setContainers] = useState<ContainerType[]>([
    {
      id: 'onTrack',
      title: 'On Track',
    },
    {
      id: 'doing',
      title: 'Doing',
    },
    {
      id: 'done',
      title: 'Done',
    },
  ])

  const containerIds = useMemo(() => containers.map((c) => c.id), [containers])
  const { items, historyItems, setItems } = useItemContext()

  const [activeContainer, setActiveContainer] = useState<ContainerType | null>(
    null,
  )
  const [activeItem, setActiveItem] = useState<ItemType | null>(null)

  // 3px移動しないとドラッグという判定にしない設定(デフォルトが0pxのため設定しないとクリックもドラッグと判定される)
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
      },
    }),
  )

  const handleOnDragStart = (e: DragStartEvent) => {
    /**
     * 現在ドラッグ中の要素を特定する処理
     */
    if (e.active.data.current?.type === 'container') {
      setActiveContainer(e.active.data.current.container)
    }
    if (e.active.data.current?.type === 'item') {
      setActiveItem(e.active.data.current.item)
    }
  }

  const handleOnDragEnd = (e: DragOverEvent) => {
    setActiveContainer(null)
    setActiveItem(null)

    const { active, over } = e

    // 移動がない場合は処理終了
    if (!over || active.id === over.id) return

    const isActiveContainer = active.data.current?.type === 'container'
    if (!isActiveContainer) return

    // ドラッグした要素が"container" typeの場合
    setContainers((containers) => {
      const activeContainerIndex = containers.findIndex(
        (con) => con.id === active.id,
      )

      const overContainerIndex = containers.findIndex(
        (con) => con.id === over.id,
      )

      return arrayMove(containers, activeContainerIndex, overContainerIndex)
    })
  }

  const handleOnDragOver = (e: DragOverEvent) => {
    const { active, over } = e

    // 移動がない場合は処理終了
    if (!over || active.id === over.id) return

    const isActiveItem = active.data.current?.type === 'item'
    const isOverItem = over.data.current?.type === 'item'

    if (isActiveItem && isOverItem) {
      // アイテムから別のアイテムへの移動の場合
      setItems((items) => {
        const activeIndex = items.findIndex((t) => t.id === active.id)
        const overIndex = items.findIndex((t) => t.id === over.id)

        if (items[activeIndex].containerId === items[overIndex].containerId) {
          // 同じコンテナ内での移動
          return arrayMove(items, activeIndex, overIndex)
        } else {
          // activeな要素のcontainerIdを移動先のcontainerIdに修正
          const destinationContainerId = items[overIndex].containerId
          items[activeIndex].containerId = destinationContainerId
          return arrayMove(items, activeIndex, overIndex - 1) // 1 => 2
        }
      })
    }

    const isOverComponent = over.data.current?.type === 'container'

    // アイテムから別のコンテナへの移動の場合
    if (isActiveItem && isOverComponent) {
      setItems((items) => {
        const activeIndex = items.findIndex((i) => i.id === active.id)

        items[activeIndex].containerId = over.id
        return arrayMove(items, activeIndex, activeIndex)
      })
    }
  }

  const historyItemTableData: HistoryItemColumn[] = historyItems.map(
    (item) => ({
      id: item.id,
      taskId: `${item.group}-${item.category}`,
      title: item.title,
      memo: item.memo,
      hours: item.hours,
      cratedAt: item.createdAt,
    }),
  )

  return (
    <div className="flex flex-col gap-4">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleOnDragStart}
        onDragEnd={handleOnDragEnd}
        onDragOver={handleOnDragOver}
      >
        <div className="grid md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          <SortableContext items={containerIds}>
            {containers.map((con) => (
              <Container
                key={con.id}
                container={con}
                items={items.filter((item) => item.containerId === con.id)}
              />
            ))}
          </SortableContext>
        </div>
        <DragOverlay>
          {activeContainer && (
            <Container
              key={activeContainer.id}
              container={activeContainer}
              items={items.filter(
                (item) => item.containerId === activeContainer.id,
              )}
            />
          )}
          {activeItem && <Item item={activeItem} />}
        </DragOverlay>
      </DndContext>
      <HistoryItemTable columns={columns} data={historyItemTableData} />
    </div>
  )
}
