import type { Metadata } from 'next'
import { Toaster } from '@/components/ui/toaster'
import { AuthProvider } from '@/hooks/use-auth'
import './globals.css'

export const metadata: Metadata = {
  title: 'WT Work Treinamentos',
  description: 'Plataforma de gerenciamento de treinamentos',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body>
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  )
}
