import type { Metadata } from 'next'
import { appConstants } from '@/constants/app'
import Header from '@/components/layout/header'
import Footer from '@/components/layout/footer'

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
    <>
      <Header />
      <main className=" flex-1 p-4 bg-muted/30">{children}</main>
      <Footer />
    </>
  )
}
