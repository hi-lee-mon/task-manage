import { z } from 'zod'

export const itemFormSchema = z.object({
  category: z.string().min(1, 'カテゴリは必須です').trim(),
  group: z.string(),
  title: z.string().min(1, 'タイトルは必須です').trim(),
  hours: z.preprocess((val) => Number(val), z.number()),
  memo: z.string(),
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
