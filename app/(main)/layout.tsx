import type { Metadata } from 'next'
import { appConstants } from '@/constants/app'
import Header from '@/components/layout/header'
import Footer from '@/components/layout/footer'
import { ItemContextProvider } from '@/context/item-context'

export const metadata: Metadata = {
  title: appConstants.title,
  description: appConstants.description,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ItemContextProvider>
      <Header />
      <div className="p-4">{children}</div>
      <Footer />
    </ItemContextProvider>
  )
}
