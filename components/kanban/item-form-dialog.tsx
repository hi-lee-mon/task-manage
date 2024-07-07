'use client'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { ItemId } from '@/types/kanban/Item'
import { ContainerId } from '@/types/kanban/container'
import { UniqueIdentifier } from '@dnd-kit/core'
import { zodResolver } from '@hookform/resolvers/zod'
import { Trash } from 'lucide-react'
import { useRef, useState } from 'react'
import { FormProvider, useFieldArray, useForm } from 'react-hook-form'
import { Button } from '../ui/button'
import { Textarea } from '../ui/textarea'
import { ItemFormSchemaType, itemFormSchema } from './itemFormSchema'

type Props = {
  dialogTitle: string
  triggerContent: React.ReactNode
  submitText: string
  targetId: ContainerId | ItemId
  defaultValues?: ItemFormSchemaType
  isContinuousCreation?: boolean
  handleSubmit: (
    form: ItemFormSchemaType,
    containerId: UniqueIdentifier,
  ) => void
}

const DEFAULT_VALUES: ItemFormSchemaType = {
  categoryNumber: '',
  groupNumber: '',
  title: '',
  hours: 0,
  memo: '',
  links: [],
}

export default function ItemFormDialog(props: Props) {
  const {
    dialogTitle,
    triggerContent,
    submitText,
    targetId,
    defaultValues = DEFAULT_VALUES,
    isContinuousCreation = false,
    handleSubmit,
  } = props

  const [open, setOpen] = useState(false)

  const categoryNumberRef = useRef<HTMLInputElement>(null)

  // TODO: ダイアログとフォームのコンポーネントをわける。今のままだとデフォルトバリューがリセットされない。ダイアログ表示がtrueになったときにuseFormを持つコンポーネントを表示させるようにする
  const methods = useForm<ItemFormSchemaType>({
    resolver: zodResolver(itemFormSchema),
    defaultValues,
  })

  const { fields, append, remove } = useFieldArray({
    name: 'links',
    control: methods.control,
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{triggerContent}</DialogTrigger>
      <DialogContent className="sm:max-w-[500px]  overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {dialogTitle}
          </DialogTitle>
        </DialogHeader>
        <FormProvider {...methods}>
          <form
            className="space-y-4"
            onSubmit={methods.handleSubmit((formData) => {
              methods.reset()
              if (categoryNumberRef.current) {
                categoryNumberRef.current.focus()
              }
              !isContinuousCreation && setOpen(false)
              handleSubmit(formData, targetId)
            })}
          >
            <div className="flex justify-between">
              <FormField
                control={methods.control}
                name="categoryNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>カテゴリNo.</FormLabel>
                    <FormControl>
                      <Input {...field} ref={categoryNumberRef} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={methods.control}
                name="groupNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>グループNo.</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={methods.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>タイトル</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={methods.control}
              name="memo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>メモ</FormLabel>
                  <FormControl>
                    <Textarea className="min-h-[20px]" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={methods.control}
              name="hours"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>実績</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {fields.map((field, index) => (
              <div key={field.id} className="flex gap-4">
                <FormField
                  control={methods.control}
                  name={`links.${index}.title`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>リンク名 {index + 1}</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={methods.control}
                  name={`links.${index}.url`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL {index + 1}</FormLabel>
                      <FormControl>
                        <div className="flex">
                          <Input {...field} className="flex-1" />
                          <Button
                            type="button"
                            variant="outline"
                            size="icon"
                            onClick={() => remove(index)}
                            className="text-red-500 hover:text-red-500"
                          >
                            <Trash className="h-4 w-4" />
                            <span className="sr-only">リンク削除</span>
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            ))}
            <DialogFooter className="flex sm:justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={() => append({ title: '', url: '' })}
              >
                リンクを追加
              </Button>
              <div className="flex gap-4">
                <Button type="submit">{submitText}</Button>
                <DialogClose asChild>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => methods.reset()}
                  >
                    閉じる
                  </Button>
                </DialogClose>
              </div>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  )
}
