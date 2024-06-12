import { appConstants } from '@/constants/app'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ModeToggle } from '../theme/mode-toggle'

export default function Header() {
  return (
    <header className="border-b">
      <div className="h-16 flex items-center gap-4 container">
        <Button variant="ghost" asChild>
          <Link href="/">{appConstants.title}</Link>
        </Button>
        <ModeToggle />
      </div>
    </header>
  )
}
