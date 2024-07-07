import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <header className="h-16 px-4 flex items-center border-b">
        <Button className="font-bold text-lg" variant="ghost" asChild>
          <Link href="/playground/next-layout/">Logo</Link>
        </Button>
        <Button variant="ghost" asChild>
          <Link href="/playground/next-layout/lp">LP</Link>
        </Button>
        <Button variant="ghost" asChild>
          <Link href="/playground/next-layout/my-page">マイページ</Link>
        </Button>
        <span className="flex-1"></span>
        <Avatar>
          <AvatarImage src="https://pbs.twimg.com/profile_images/1809730815066271744/UMdIQ1tk_400x400.png" />
        </Avatar>
      </header>
      <main className="p-4 h-[400px]">{children}</main>
      <footer className="border-t h-16 flex items-center px-4">Footer</footer>
    </>
  )
}
