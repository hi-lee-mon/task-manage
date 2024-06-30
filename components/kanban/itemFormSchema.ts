import { z } from 'zod'

export const itemFormSchema = z.object({
  categoryNumber: z.string().min(1, 'カテゴリNo.は必須です').trim(),
  groupNumber: z.string().min(1, 'グループNo.は必須です').trim(),
  title: z.string().min(1, 'タイトルは必須です').trim(),
  hours: z.preprocess((val) => Number(val), z.number()),
  memo: z.string().min(1, 'メモは必須です'),
  links: z.array(
    z
      .object({
        title: z.string(),
        url: z.string().url('リンクのURLが正しくありません'),
      })
      .refine((data) => data.title.trim() !== '' && data.url.trim() !== '', {
        message: 'タイトルとURLの両方を入力してください',
        path: ['title'], // エラーメッセージを表示するフィールド
      }),
  ),
})

export type ItemFormSchemaType = z.infer<typeof itemFormSchema>
