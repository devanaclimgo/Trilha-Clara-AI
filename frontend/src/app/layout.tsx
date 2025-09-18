import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

import { GoogleOAuthProvider } from '@react-oauth/google'
import { GOOGLE_CONFIG } from '../../config/google'
import { CustomToaster } from '@/components/ui/custom-toaster'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

{
  /* rever description */
}
export const metadata: Metadata = {
  title: 'Trilha Clara IA',
  description:
    'Plataforma moderna e confiável para orientação de projetos acadêmicos',
  generator: 'v0.app',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <GoogleOAuthProvider clientId={GOOGLE_CONFIG.CLIENT_ID}>
          {children}
          <CustomToaster />
        </GoogleOAuthProvider>
      </body>
    </html>
  )
}
