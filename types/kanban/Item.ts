import { UniqueIdentifier } from '@dnd-kit/core'
import { ContainerId } from './container'

export type ItemId = UniqueIdentifier
export type ItemType = {
  id: ItemId
  containerId: ContainerId
  category: string
  group: string
  title: string
  hours: number
  memo: string
  links: {
    title: string
    url: string
  }[]
  createdAt: string
}
