import { ModeToggle } from '../theme/mode-toggle'

export default function Footer() {
  return (
    <footer className="border-t sticky top-full">
      <div className="h-16 container flex items-center">
        <p className="text-muted-foreground flex-1">&copy; shun 2024</p>
        <ModeToggle />
      </div>
    </footer>
  )
}
