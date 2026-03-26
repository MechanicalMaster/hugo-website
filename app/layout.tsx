import type { Metadata } from 'next'
import { Inter, DM_Serif_Display } from 'next/font/google'
import Script from 'next/script'
import { ThemeProvider } from '@/components/ThemeProvider'
import { Navbar } from '@/components/Navbar'
import { Footer } from '@/components/Footer'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

const dmSerifDisplay = DM_Serif_Display({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-dm-serif',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Ronak Sethiya — Product Manager | AI & Fintech',
    template: '%s | Ronak Sethiya',
  },
  description:
    'Product Manager focused on AI & Fintech. I build products that ship and scale. Explore my projects, case studies, and experience.',
  metadataBase: new URL('https://ronaksethiya.com'),
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://ronaksethiya.com',
    siteName: 'Ronak Sethiya',
    title: 'Ronak Sethiya — Product Manager | AI & Fintech',
    description:
      'Product Manager focused on AI & Fintech. I build products that ship and scale.',
    images: [
      {
        url: '/images/avatar.png',
        width: 800,
        height: 800,
        alt: 'Ronak Sethiya',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ronak Sethiya — Product Manager | AI & Fintech',
    description:
      'Product Manager focused on AI & Fintech. I build products that ship and scale.',
    images: ['/images/avatar.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${dmSerifDisplay.variable}`}>
        <ThemeProvider>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </ThemeProvider>
        <Script src="/js/ai-chat-widget.js" strategy="afterInteractive" />
      </body>
    </html>
  )
}
