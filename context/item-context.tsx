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
  historyItems: ItemType[]
  setItems: Dispatch<SetStateAction<ItemType[]>>
  addItem: (form: ItemFormSchemaType, containerId: UniqueIdentifier) => void
  editItem: (form: ItemFormSchemaType, itemId: ItemId) => void
  deleteItem: (itemId: ItemId) => void
  restoreHistoryItems: (historyItemIds: ItemId[]) => void
  deleteHistoryItems: (historyItemIds: ItemId[]) => void
}

const Context = createContext<ContextType>({} as ContextType)

export function ItemContextProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useLocalStorageState<ItemType[]>('items', {
    defaultValue: [],
  })
  const [historyItems, setHistoryItems] = useLocalStorageState<ItemType[]>(
    'historyItems',
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
    setHistoryItems((prevItems) => {
      const i = items.find((item) => item.id === itemId)
      return i ? [...prevItems, i] : prevItems
    })
  }

  const restoreHistoryItems = (historyItemIds: ItemId[]) => {
    setItems((prevItems) => {
      return historyItemIds.reduce((accumulator, historyItemId) => {
        const restoreItem = historyItems.find(
          (item) => item.id === historyItemId,
        )
        return restoreItem ? [restoreItem, ...accumulator] : accumulator
      }, prevItems)
    })
    setHistoryItems((prevItems) => {
      return prevItems.filter((item) => !historyItemIds.includes(item.id))
    })
  }

  const deleteHistoryItems = (historyItemIds: ItemId[]) => {
    setHistoryItems((prevItems) => {
      return prevItems.filter((item) => !historyItemIds.includes(item.id))
    })
  }

  return (
    <Context.Provider
      value={{
        items,
        historyItems,
        setItems,
        addItem,
        editItem,
        deleteItem,
        restoreHistoryItems,
        deleteHistoryItems,
      }}
    >
      {children}
    </Context.Provider>
  )
}

export const useItemContext = () => useContext(Context)
