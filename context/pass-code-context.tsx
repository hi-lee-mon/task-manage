'use client'

import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from 'react'

type ContextType = {
  passCode: string | null
  setPassCode: Dispatch<SetStateAction<string | null>>
}

const Context = createContext<ContextType>({} as ContextType)

export const usePassCodeContext = () => useContext(Context)

export function PassCodeContextProvider({ children }: { children: ReactNode }) {
  const [passCode, setPassCode] = useState<string | null>(null)

  return (
    <Context.Provider value={{ passCode, setPassCode }}>
      {children}
    </Context.Provider>
  )
}
