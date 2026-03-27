import type { Metadata } from 'next'
import { Poppins, Syne } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

const poppins = Poppins({
  variable: '--font-sans',
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
})

const syne = Syne({
  variable: '--font-display',
  subsets: ['latin'],
  weight: ['700', '800'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Kairo – Train Your Soft Skills',
  description: 'AI-powered soft skills training with gamification. Practice negotiation, leadership, and communication through realistic simulations.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`dark ${poppins.variable} ${syne.variable}`}>
      <body className="antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
