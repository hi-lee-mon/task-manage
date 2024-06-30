import type { Metadata } from 'next'
import { Noto_Sans_JP } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from 'next-themes'
import Footer from '../components/layout/footer'
import Header from '../components/layout/header'
import { cn } from '@/lib/utils'
import { appConstants } from '@/constants/app'

const notoSansJp = Noto_Sans_JP({ subsets: ['latin'] })

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
    <html lang="ja" suppressHydrationWarning>
      <body className={cn(notoSansJp.className, 'min-h-dvh flex flex-col')}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Header />
          <main className="flex-1 bg-muted/40  px-10 pt-4">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}
