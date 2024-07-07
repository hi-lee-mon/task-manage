'use client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import useLocalStorageState from 'use-local-storage-state'

export default function Page() {
  const [value, setValue, { isPersistent }] = useLocalStorageState('test', {
    defaultValue: 'test',
  })
  const [input, setInput] = useState('')

  const handleClick = () => {
    localStorage.setItem('test', 'dfdf')
  }

  return (
    <div className="flex flex-col gap-4">
      <div>value: {value}</div>
      <Input value={input} onChange={(e) => setInput(e.target.value)} />
      <Button onClick={handleClick}>set value</Button>
      {!isPersistent && <span>Changes are not currently persisted.</span>}
    </div>
  )
}
