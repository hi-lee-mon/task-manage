import { ComponentProps } from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

type LinkProps = React.PropsWithChildren<{ href: string }> &
  ComponentProps<typeof Button>

const CusLink = (props: LinkProps) => {
  return (
    <Button variant={props.variant} asChild>
      <Link href={props.href}>{props.children}</Link>
    </Button>
  )
}

export default function Page() {
  return (
    <div className="flex gap-4">
      <CusLink href="playground/kanban" variant="outline">
        kanban
      </CusLink>
      <CusLink href="playground/next-layout" variant="outline">
        next-layout
      </CusLink>
      <CusLink href="playground/local-storage" variant="outline">
        local-storage
      </CusLink>
    </div>
  )
}
