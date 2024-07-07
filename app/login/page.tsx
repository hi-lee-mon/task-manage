'use client'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { usePassCodeContext } from '@/context/pass-code-context'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function Page() {
  const router = useRouter()
  const { setPassCode } = usePassCodeContext()
  const [inputPassCode, setInputPassCode] = useState('')
  return (
    <div className="flex justify-center mt-32">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">ログイン</CardTitle>
          <CardDescription>任意の値を入力してください</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="passCode">パスコード</Label>
            <Input
              id="passCode"
              type="password"
              required
              value={inputPassCode}
              onChange={(e) => setInputPassCode(e.target.value)}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button
            className="w-full"
            onClick={() => {
              setPassCode(inputPassCode)
              router.push('/')
            }}
          >
            ログイン
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
