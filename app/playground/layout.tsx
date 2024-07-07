import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-4">
      <header className="h-16 px-4 flex items-center border-b gap-4">
        <Button variant="link" asChild>
          <Link href="/">Home</Link>
        </Button>
        <Button variant="link" asChild>
          <Link href="/playground">Playground</Link>
        </Button>
      </header>
      <div className="p-4">{children}</div>
    </div>
  )
}
