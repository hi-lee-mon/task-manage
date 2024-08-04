'use client'

import { ItemFormSchemaType } from '@/components/kanban/itemFormSchema'
import { ItemId, ItemType } from '@/types/kanban/Item'
import { UniqueIdentifier } from '@dnd-kit/core'
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
} from 'react'
import useLocalStorageState from 'use-local-storage-state'

type ContextType = {
  items: ItemType[]
  deletedItems: ItemType[]
  setItems: Dispatch<SetStateAction<ItemType[]>>
  addItem: (form: ItemFormSchemaType, containerId: UniqueIdentifier) => void
  editItem: (form: ItemFormSchemaType, itemId: ItemId) => void
  deleteItem: (itemId: ItemId) => void
  restoreItems: (deletedItemIds: ItemId[]) => void
}

const Context = createContext<ContextType>({} as ContextType)

export function ItemContextProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useLocalStorageState<ItemType[]>('items', {
    defaultValue: [],
  })
  const [deletedItems, setDeletedItems] = useLocalStorageState<ItemType[]>(
    'deletedItems',
    {
      defaultValue: [],
    },
  )

  const addItem = (form: ItemFormSchemaType, containerId: UniqueIdentifier) => {
    const newItem: ItemType = {
      id: crypto.randomUUID(),
      containerId,
      ...form,
      hours: form.hours,
      createdAt: new Date().toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' }),
    }
    setItems((prev) => [newItem, ...prev])
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

  const deleteItem = (itemId: ItemId) => {
    setItems((prevItems) => {
      return prevItems.filter((item) => item.id !== itemId)
    })
    setDeletedItems((prevItems) => {
      const i = items.find((item) => item.id === itemId)
      return i ? [...prevItems, i] : prevItems
    })
  }

  const restoreItems = (restoreItemIds: ItemId[]) => {
    setItems((prevItems) => {
      return restoreItemIds.reduce((acc, restoreItemId) => {
        const restoreItem = deletedItems.find(
          (item) => item.id === restoreItemId,
        )
        return restoreItem ? [restoreItem, ...acc] : acc
      }, prevItems)
    })
    setDeletedItems((prevItems) => {
      return prevItems.filter((item) => !restoreItemIds.includes(item.id))
    })
  }

  return (
    <Context.Provider
      value={{
        items,
        deletedItems,
        setItems,
        addItem,
        editItem,
        deleteItem,
        restoreItems,
      }}
    >
      {children}
    </Context.Provider>
  )
}

export const useItemContext = () => useContext(Context)
