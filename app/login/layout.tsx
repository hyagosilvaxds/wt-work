import type { Metadata } from 'next'
import { Toaster } from '@/components/ui/toaster'
import '../globals.css'

export const metadata: Metadata = {
  title: 'Login - WT Work Treinamentos',
  description: 'Acesse sua conta na plataforma de gerenciamento de treinamentos',
}

export default function LoginLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
