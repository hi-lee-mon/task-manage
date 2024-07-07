import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex">
      <div className="w-40 border-r p-4">サイドメニュー</div>
      <div className="flex-1 p-4">{children}</div>
    </div>
  )
}
