'use client'

import { ItemId, ItemType } from '@/types/kanban/Item'
import { ContainerType } from '@/types/kanban/container'
import {
  useSensors,
  useSensor,
  PointerSensor,
  DndContext,
  closestCorners,
  DragOverlay,
  DragOverEvent,
  DragStartEvent,
  UniqueIdentifier,
} from '@dnd-kit/core'
import { arrayMove, SortableContext } from '@dnd-kit/sortable'
import Item from '@/components/kanban/item'
import Container from '@/components/kanban/container'
import { useState, useMemo } from 'react'
import { ItemFormSchemaType } from '@/components/kanban/itemFormSchema'

const defaultContainers: ContainerType[] = [
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
]

const defaultItems: ItemType[] = [
  {
    id: '1',
    containerId: 'onTrack',
    categoryNumber: '2',
    groupNumber: '30',
    title: 'TCF作成',
    hours: 1,
    memo: 'TCFの作成についての説明を書いてください。TCFの作成についての説明を書いてください。TCFの作成についての説明を書いてください。TCFの作成についての説明を書いてください。TCFの作成についての説明を書いてください。TCFの作成についての説明を書いてください。TCFの作成についての説明を書いてください。TCFの作成についての説明を書いてください。TCFの作成についての説明を書いてください。TCFの作成についての説明を書いてください。',
    links: [
      {
        title: 'Google',
        url: 'https://www.google.co.jp/',
      },
      {
        title: 'TCF作成TCF作成TCF作成TCF作成TCF作成',
        url: 'https://www.google.co.jp/',
      },
      {
        title: 'マスタ管理',
        url: 'https://www.google.co.jp/',
      },
      {
        title: 'マスタ管理',
        url: 'https://www.google.co.jp/',
      },
    ],
    createdAt: '2023-01-01T00:00:00.000Z',
  },
  {
    id: '2',
    containerId: 'onTrack',
    categoryNumber: '2',
    groupNumber: '30',
    title: 'TCF作成',
    hours: 3.5,
    memo: 'TCFの作成についての説明を書いてください。TCFの作成についての説明を書いてください。TCFの作成についての説明を書いてください。TCFの作成についての説明を書いてください。TCFの作成についての説明を書いてください。TCFの作成についての説明を書いてください。TCFの作成についての説明を書いてください。TCFの作成についての説明を書いてください。TCFの作成についての説明を書いてください。TCFの作成についての説明を書いてください。',
    links: [
      {
        title: 'Google',
        url: 'https://www.google.co.jp/',
      },
      {
        title: 'TCF作成TCF作成TCF作成TCF作成TCF作成',
        url: 'https://www.google.co.jp/',
      },
      {
        title: 'マスタ管理',
        url: 'https://www.google.co.jp/',
      },
      {
        title: 'マスタ管理',
        url: 'https://www.google.co.jp/',
      },
    ],
    createdAt: '2023-01-01T00:00:00.000Z',
  },
]

export default function Home() {
  const [containers, setContainers] =
    useState<ContainerType[]>(defaultContainers)
  const containerIds = useMemo(() => containers.map((c) => c.id), [containers])
  const [items, setItems] = useState<ItemType[]>([])
  const [activeContainer, setActiveContainer] = useState<ContainerType | null>(
    null,
  )
  const [activeItem, setActiveItem] = useState<ItemType | null>(null)

  console.log(items)

  const addItem = (form: ItemFormSchemaType, containerId: UniqueIdentifier) => {
    const newItem: ItemType = {
      id: crypto.randomUUID(),
      containerId,
      ...form,
      hours: form.hours,
      createdAt: new Date().toISOString(),
    }
    setItems((prev) => [...prev, newItem])
  }

  const editItem = (form: ItemFormSchemaType, itemId: ItemId) => {
    setItems((prevItems) => {
      return prevItems.map((prevItem) => {
        if (prevItem.id === itemId) {
          return {
            ...prevItem,
            ...form,
          }
        }
        return prevItem
      })
    })
  }

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

  return (
    <div>
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
                addItem={addItem}
                editItem={editItem}
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
              addItem={addItem}
              editItem={editItem}
            />
          )}
          {activeItem && <Item item={activeItem} editItem={editItem} />}
        </DragOverlay>
      </DndContext>
    </div>
  )
}
