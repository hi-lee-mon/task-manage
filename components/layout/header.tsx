import { appConstants } from '@/constants/app'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export default function Header() {
  return (
    <header className="border-b">
      <div className="h-16 flex items-center container">
        <div className="flex gap-4 flex-1 items-center">
          <Button variant="ghost" asChild>
            <Link href="/">{appConstants.title}</Link>
          </Button>
        </div>
        <Button variant="ghost" asChild>
          <Link href="/playground">playground</Link>
        </Button>
      </div>
    </header>
  )
}
