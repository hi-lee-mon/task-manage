import type { Metadata } from 'next'
import { Noto_Sans_JP } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from 'next-themes'
import { cn } from '@/lib/utils'
import { appConstants } from '@/constants/app'
import { PassCodeContextProvider } from '@/context/pass-code-context'

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
      <body className={notoSansJp.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <PassCodeContextProvider>
            <main className="min-h-dvh flex flex-col">{children}</main>
          </PassCodeContextProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
